import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
  SkeletonHelper,
} from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { useCursor, useTexture, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { pageAtom, pages } from "./UI";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0); //x 轴平移一半

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // calculate the skin index
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // calculate the skin weight
  console.log("@@@", skinIndex, skinWeight);
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
  // console.log(i, vertex, position, x, skinIndex, skinWeight, position);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`,
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone); // attach the new bone to the previous bone
      }
    }
    const skeleton = new Skeleton(bones);
    // 设置立方体六个面的材质
    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,

        roughness: 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        emissive: emissiveColor, //自发光颜色
        emissiveIntensity: 0,
      }),
    ];
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);

  // useHelper(skinnedMeshRef, SkeletonHelper, "red");
  let flag = 1;
  // delta 是时钟
  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }
    const emissiveIntensity = highlighted ? 0.22 : 0;
    // 鼠标移入后设置前后两面的自发光线性变强
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;

    targetRotation += degToRad(number * 2);

    const bones = skinnedMeshRef.current.skeleton.bones;
    if (flag) {
      flag = 0;
    }
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity =
        i < 8 ? insideCurveStrength * Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity =
        i >= 8 ? outsideCurveStrength * Math.cos(i * 0.3 + 0.09) : 0;
      let rotationAngle =
        insideCurveIntensity * targetRotation -
        outsideCurveIntensity * targetRotation;
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta
      );
    }
  });
  useHelper(skinnedMeshRef, SkeletonHelper, "red");
  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};
export default Page;
