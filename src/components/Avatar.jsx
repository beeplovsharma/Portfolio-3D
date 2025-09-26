import { useAnimations, useFBX, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useMobile } from "../hooks/useMobile";

export function Avatar(props) {
  const { nodes, materials } = useGLTF("/models/beeplov.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: walkingAnimation } = useFBX("/animations/Walking.fbx");

  // Set animation names exactly like your working version
  idleAnimation[0].name = "Idle";
  walkingAnimation[0].name = "Walking";

  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], walkingAnimation[0]],
    group
  );

  const [animation, setAnimation] = useState("Idle");
  
  // Exact same useEffect pattern as your working version
  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  const scrollData = useScroll();
  const lastScroll = useRef(0);
  const { isMobile } = useMobile();

  // Exact same useFrame logic as your working version
  useFrame(() => {
    const scrollDelta = scrollData.offset - lastScroll.current;
    let rotationTarget = 0;
    if (Math.abs(scrollDelta) > 0.00001) {
      setAnimation("Walking");
      if (scrollDelta > 0) {
        rotationTarget = isMobile ? Math.PI / 2 : 0;
      } else {
        rotationTarget = isMobile ? -Math.PI / 2 : Math.PI;
      }
    } else {
      setAnimation("Idle");
    }
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotationTarget,
      0.1
    );
    lastScroll.current = scrollData.offset;
  });

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="avaturn_body"
        geometry={nodes.avaturn_body.geometry}
        material={materials.avaturn_body_material}
        skeleton={nodes.avaturn_body.skeleton}
      />
      <skinnedMesh
        name="avaturn_hair_0"
        geometry={nodes.avaturn_hair_0.geometry}
        material={materials.avaturn_hair_0_material}
        skeleton={nodes.avaturn_hair_0.skeleton}
      />
      <skinnedMesh
        name="avaturn_shoes_0"
        geometry={nodes.avaturn_shoes_0.geometry}
        material={materials.avaturn_shoes_0_material}
        skeleton={nodes.avaturn_shoes_0.skeleton}
      />
      <skinnedMesh
        name="avaturn_look_0"
        geometry={nodes.avaturn_look_0.geometry}
        material={materials.avaturn_look_0_material}
        skeleton={nodes.avaturn_look_0.skeleton}
      />
    </group>
  );
}

// Preload exactly like your working version
useGLTF.preload("/models/beeplov.glb");
useFBX.preload("/animations/Idle.fbx");
useFBX.preload("/animations/Walking.fbx");
