import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

function Motorbike({ position, color }:{position:[number,number,number];color:string}){
  return (
    <group position={position}>
      <mesh position={[-0.32,0.22,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.18,0.18,0.08,10]}/><meshStandardMaterial color="#111827"/></mesh>
      <mesh position={[0.32,0.22,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.18,0.18,0.08,10]}/><meshStandardMaterial color="#111827"/></mesh>
      <mesh position={[0,0.38,0]}><boxGeometry args={[0.72,0.16,0.22]}/><meshStandardMaterial color={color} roughness={0.5}/></mesh>
      <mesh position={[0.22,0.58,0]} rotation={[0,0,-0.35]}><boxGeometry args={[0.18,0.48,0.16]}/><meshStandardMaterial color={color}/></mesh>
      <mesh position={[0.36,0.78,0]}><boxGeometry args={[0.42,0.05,0.08]}/><meshStandardMaterial color="#1f2937"/></mesh>
    </group>
  );
}

function Shopfront({x,label,color}:{x:number;label:string;color:string}){
  return (
    <group position={[x,0,-8.7]}>
      <mesh position={[0,2.2,0]}><boxGeometry args={[3.3,4.4,1.4]}/><meshStandardMaterial color="#e7e5e4" roughness={0.9}/></mesh>
      <mesh position={[0,1.25,0.73]}><planeGeometry args={[2.5,2.1]}/><meshStandardMaterial color="#94a3b8" emissive="#dbeafe" emissiveIntensity={0.12}/></mesh>
      <mesh position={[0,3.25,0.76]}><boxGeometry args={[2.8,0.65,0.08]}/><meshStandardMaterial color={color}/></mesh>
      <Text position={[0,3.25,0.81]} fontSize={0.14} color="#fff" anchorX="center" anchorY="middle" fontWeight="bold">{label}</Text>
    </group>
  );
}

export function Floor1Lobby(){
  return (
    <group>
      <color attach="background" args={['#d9ecf5']} />
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#f7fbff','#8b8f82',1.05]} />
      <directionalLight position={[8,14,10]} intensity={1.1} color="#fff4dc" />

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0,-0.12,2]} receiveShadow>
          <boxGeometry args={[22,0.24,28]}/>
          <meshStandardMaterial color="#e9e5dc" roughness={0.75}/>
        </mesh>
      </RigidBody>

      {/* UID ground-floor lobby */}
      <mesh position={[-5.6,1.05,5.8]}>
        <boxGeometry args={[4.5,2.1,1.1]}/>
        <meshStandardMaterial color="#c99b6a" roughness={0.8}/>
      </mesh>
      <mesh position={[-5.6,2.18,5.8]}>
        <boxGeometry args={[4.7,0.16,1.25]}/>
        <meshStandardMaterial color="#f8fafc"/>
      </mesh>
      <Text position={[-5.6,2.7,5.18]} fontSize={0.22} color="#164e63" anchorX="center" anchorY="middle" fontWeight="bold">
        UID • GÒ DẦU • LẦU 1
      </Text>

      {/* glass frontage looking straight onto Vietnamese street */}
      <group position={[0,2.25,-1.8]}>
        <mesh>
          <boxGeometry args={[18,4.5,0.05]}/>
          <meshStandardMaterial color="#9bd0df" transparent opacity={0.16} depthWrite={false}/>
        </mesh>
        {[-8,-4,0,4,8].map(x=><mesh key={x} position={[x,0,0.03]}><boxGeometry args={[0.06,4.5,0.08]}/><meshStandardMaterial color="#202327"/></mesh>)}
      </group>

      {/* front doors/opening toward street */}
      <mesh position={[0,2.25,8.8]}>
        <boxGeometry args={[18,4.5,0.08]}/>
        <meshStandardMaterial color="#b6d7df" transparent opacity={0.12} depthWrite={false}/>
      </mesh>
      {[-4.5,4.5].map(x=><mesh key={x} position={[x,2.25,8.84]}><boxGeometry args={[0.06,4.5,0.08]}/><meshStandardMaterial color="#202327"/></mesh>)}

      {/* Vietnamese sidewalk + road visible through facade */}
      <mesh position={[0,0.01,-4.3]}>
        <boxGeometry args={[24,0.08,3.3]}/>
        <meshStandardMaterial color="#bcb8ae" roughness={0.95}/>
      </mesh>
      <mesh position={[0,-0.02,-7.4]}>
        <boxGeometry args={[28,0.08,4.0]}/>
        <meshStandardMaterial color="#4b5563" roughness={0.9}/>
      </mesh>
      <mesh position={[0,0.025,-7.4]}>
        <boxGeometry args={[11,0.025,0.07]}/>
        <meshBasicMaterial color="#facc15"/>
      </mesh>
      {[-8,-3,2,7].map((x,i)=><Motorbike key={x} position={[x,0,-6.3+(i%2)*0.55]} color={['#dc2626','#2563eb','#16a34a','#f59e0b'][i]}/>)}

      <Shopfront x={-6.2} label="CÀ PHÊ • NƯỚC MÍA" color="#92400e"/>
      <Shopfront x={-2.3} label="CƠM TẤM GÒ DẦU" color="#b91c1c"/>
      <Shopfront x={2.2} label="TẠP HOÁ" color="#0f766e"/>
      <Shopfront x={6.2} label="SỬA XE • RỬA XE" color="#1d4ed8"/>

      {/* utility poles + overhead cables */}
      {[-8.5,8.5].map(x=>(
        <group key={x} position={[x,0,-5.4]}>
          <mesh position={[0,2.6,0]}><cylinderGeometry args={[0.07,0.09,5.2,8]}/><meshStandardMaterial color="#6b7280"/></mesh>
          <mesh position={[0,4.55,0]}><boxGeometry args={[1.5,0.07,0.07]}/><meshStandardMaterial color="#374151"/></mesh>
        </group>
      ))}
      <mesh position={[0,4.55,-5.4]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.012,0.012,17,5]}/><meshBasicMaterial color="#111827"/></mesh>

      {/* elevator / stairs to floor 2 */}
      <group position={[6.4,0,5.2]}>
        <mesh position={[0,1.5,0]}><boxGeometry args={[2.6,3.0,0.22]}/><meshStandardMaterial color="#374151" metalness={0.5} roughness={0.35}/></mesh>
        <mesh position={[0,1.5,0.13]}><planeGeometry args={[2.1,2.55]}/><meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.3}/></mesh>
        <Text position={[0,3.35,0.16]} fontSize={0.14} color="#fef3c7" anchorX="center" anchorY="middle" fontWeight="bold">
          THANG MÁY LÊN LẦU 2 • BẤM E
        </Text>
      </group>

      <Text position={[0,3.8,7.9]} fontSize={0.16} color="#164e63" anchorX="center" anchorY="middle" fontWeight="bold">
        SẢNH UID • NHÌN RA ĐƯỜNG GÒ DẦU
      </Text>
    </group>
  );
}
