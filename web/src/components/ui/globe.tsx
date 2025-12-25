"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

// --- Constants ---
const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

// Lazy-load ThreeGlobe only on client to prevent VERTEX error
let ThreeGlobeClass: any = null;

async function getThreeGlobe() {
    if (ThreeGlobeClass) return ThreeGlobeClass;
    const { default: ThreeGlobe } = await import("three-globe");
    ThreeGlobeClass = ThreeGlobe;
    extend({ ThreeGlobe });
    return ThreeGlobe;
}

type Position = {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
};

export type GlobeConfig = {
    pointSize?: number;
    globeColor?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    emissive?: string;
    emissiveIntensity?: number;
    shininess?: number;
    polygonColor?: string;
    ambientLight?: string;
    directionalLeftLight?: string;
    directionalTopLight?: string;
    pointLight?: string;
    arcTime?: number;
    arcLength?: number;
    rings?: number;
    maxRings?: number;
    initialPosition?: {
        lat: number;
        lng: number;
    };
    autoRotate?: boolean;
    autoRotateSpeed?: number;
};

interface WorldProps {
    globeConfig: GlobeConfig;
    data: Position[];
    rings?: {
        lat: number;
        lng: number;
        color: string;
    }[];
}

export function Globe({ globeConfig, data, rings }: WorldProps) {
    const globeRef = useRef<any>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const defaultProps = {
        pointSize: 1,
        atmosphereColor: "#ffffff",
        showAtmosphere: true,
        atmosphereAltitude: 0.1,
        polygonColor: "rgba(255,255,255,0.7)",
        globeColor: "#1d072e",
        emissive: "#000000",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        arcTime: 2000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        ...globeConfig,
    };

    // Initialize globe only once
    useEffect(() => {
        const init = async () => {
            if (typeof window === "undefined") return;
            const TG = await getThreeGlobe();
            if (!globeRef.current && groupRef.current) {
                globeRef.current = new TG();
                (groupRef.current as any).add(globeRef.current);
                setIsInitialized(true);
            }
        };
        init();
    }, []);

    // Build material when globe is initialized or when relevant props change
    useEffect(() => {
        if (!globeRef.current || !isInitialized) return;
        const material = globeRef.current.globeMaterial();
        if (!material) return;

        const globeMaterial = material as unknown as {
            color: THREE.Color;
            emissive: THREE.Color;
            emissiveIntensity: number;
            shininess: number;
        };
        globeMaterial.color = new THREE.Color(globeConfig.globeColor);
        globeMaterial.emissive = new THREE.Color(globeConfig.emissive);
        globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
        globeMaterial.shininess = globeConfig.shininess || 0.9;
    }, [
        isInitialized,
        globeConfig.globeColor,
        globeConfig.emissive,
        globeConfig.emissiveIntensity,
        globeConfig.shininess,
    ]);

    // Build data when globe is initialized or when data changes
    useEffect(() => {
        if (!globeRef.current || !isInitialized || !data) return;

        globeRef.current
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(2)
            .hexPolygonMargin(0.7)
            .showAtmosphere(defaultProps.showAtmosphere)
            .atmosphereColor(defaultProps.atmosphereColor)
            .atmosphereAltitude(defaultProps.atmosphereAltitude)
            .hexPolygonColor(() => defaultProps.polygonColor);

        globeRef.current
            .arcsData(data)
            .arcStartLat((d: any) => d.startLat * 1)
            .arcStartLng((d: any) => d.startLng * 1)
            .arcEndLat((d: any) => d.endLat * 1)
            .arcEndLng((d: any) => d.endLng * 1)
            .arcColor((e: any) => e.color)
            .arcAltitude((e: any) => e.arcAlt * 1)
            .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
            .arcDashLength(defaultProps.arcLength)
            .arcDashInitialGap((e: any) => e.order * 1)
            .arcDashGap(15)
            .arcDashAnimateTime(() => defaultProps.arcTime);

        const points = [];
        for (let i = 0; i < data.length; i++) {
            const arc = data[i];
            points.push({
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.startLat,
                lng: arc.startLng,
            });
            points.push({
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.endLat,
                lng: arc.endLng,
            });
        }

        const filteredPoints = points.filter(
            (v, i, a) =>
                a.findIndex((v2) =>
                    ["lat", "lng"].every(
                        (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
                    ),
                ) === i,
        );

        globeRef.current
            .pointsData(filteredPoints)
            .pointColor((e: any) => e.color)
            .pointsMerge(true)
            .pointAltitude(0.0)
            .pointRadius(2);

        if (rings) {
            globeRef.current
                .ringsData(rings)
                .ringColor((e: any) => e.color)
                .ringMaxRadius(defaultProps.maxRings)
                .ringPropagationSpeed(RING_PROPAGATION_SPEED)
                .ringRepeatPeriod(
                    (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
                );
        }

    }, [
        isInitialized,
        data,
        rings,
        defaultProps.pointSize,
        defaultProps.showAtmosphere,
        defaultProps.atmosphereColor,
        defaultProps.atmosphereAltitude,
        defaultProps.polygonColor,
        defaultProps.arcLength,
        defaultProps.arcTime,
        defaultProps.rings,
        defaultProps.maxRings,
    ]);

    useEffect(() => {
        if (!globeRef.current || !isInitialized || !data || rings) return;

        const interval = setInterval(() => {
            if (!globeRef.current) return;

            const newNumbersOfRings = genRandomNumbers(
                0,
                data.length,
                Math.floor((data.length * 4) / 5),
            );

            const ringsData = data
                .filter((d, i) => newNumbersOfRings.includes(i))
                .map((d) => ({
                    lat: d.startLat,
                    lng: d.startLng,
                    color: d.color,
                }));

            globeRef.current.ringsData(ringsData);
        }, 2000);

        return () => clearInterval(interval);
    }, [isInitialized, data, rings]);

    return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
    const { gl, size } = useThree();

    useEffect(() => {
        gl.setPixelRatio(window.devicePixelRatio);
        gl.setSize(size.width, size.height);
        // Removed setClearColor call for simplicity or fixed it
    }, [gl, size]);

    return null;
}

export function World(props: WorldProps) {
    const { globeConfig } = props;
    const [scene] = useState(() => {
        const s = new THREE.Scene();
        s.fog = new THREE.Fog(0xffffff, 400, 2000);
        return s;
    });

    return (
        <Canvas scene={scene} camera={new THREE.PerspectiveCamera(50, aspect, 180, 1800)}>
            <WebGLRendererConfig />
            <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
            <directionalLight
                color={globeConfig.directionalLeftLight}
                position={new THREE.Vector3(-400, 100, 400)}
            />
            <directionalLight
                color={globeConfig.directionalTopLight}
                position={new THREE.Vector3(-200, 500, 200)}
            />
            <pointLight
                color={globeConfig.pointLight}
                position={new THREE.Vector3(-200, 500, 200)}
                intensity={0.8}
            />
            <Globe {...props} />
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                minDistance={cameraZ}
                maxDistance={cameraZ}
                autoRotateSpeed={1}
                autoRotate={true}
                minPolarAngle={Math.PI / 3.5}
                maxPolarAngle={Math.PI - Math.PI / 3}
            />
        </Canvas>
    );
}

export function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
    const arr: number[] = [];
    while (arr.length < count) {
        const r = Math.floor(Math.random() * (max - min)) + min;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}
