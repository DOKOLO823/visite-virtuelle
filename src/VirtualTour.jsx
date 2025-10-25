import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Panorama from './Panorama';
import Hotspot from './Hotspot';
import InteractiveModel from './InteractiveModel';
import CameraMover from './CameraMover';
import topimg from '../public/constant/top.png';
import bottomimg from '../public/constant/bottom.png';

export default function VirtualTour() {
  const [scene, setScene] = useState('scene1');
  const [idscene, setIdscene]=useState(parseInt(scene[5]))
  const [modalInfo, setModalInfo] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(90);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [views, setViews] = useState(132);
  const [showUI, setShowUI] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [texteExplicatif, setTexteExplicatif] = useState('');
  const [showTexte, setShowTexte] = useState(false);
  const [firstInteraction, setFirstInteraction] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [sceneOpacity, setSceneOpacity] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(()=>{
    setIdscene(parseInt(scene[5]))
  },[scene])

  const cameraRef = useRef();
  const moveInterval = useRef(null);

  const textesParScene = {
    scene1: "Bienvenue dans la scène 1. Découvrez cette magnifique statue en 3D.1",
    scene2: "Bienvenue dans la scène 2. Observez cet objet archéologique rare2.",
    scene3: "Bienvenue dans la scène 1. Découvrez cette magnifique statue en 3D3.",
    scene4: "Bienvenue dans la scène 2. Observez cet objet archéologique rare4.",
    scene5: "Bienvenue dans la scène 1. Découvrez cette magnifique statue en 3D5.",
    scene6: "Bienvenue dans la scène 2. Observez cet objet archéologique rare6.",
    scene7: "Bienvenue dans la scène 1. Découvrez cette magnifique statue en 3D7.",
  };

  useEffect(() => {
    setTexteExplicatif(textesParScene[scene]);
    setShowTexte(true);
    setTimeout(() => setShowTexte(false), 10000);
    setTimeout(() => setSceneOpacity(1), 100);
  }, []);

  useEffect(() => {
    setTexteExplicatif(textesParScene[scene]);
    setShowTexte(true);
    const timer = setTimeout(() => setShowTexte(false), 10000);
    return () => clearTimeout(timer);
  }, [scene]);

  const switchScene = (nextScene) => {
    if (scene === nextScene || transitioning) return;
    setTransitioning(true);
    setSceneOpacity(0);
    setTimeout(() => {
      setScene(nextScene);
      setSceneOpacity(1);
      setTransitioning(false);
    }, 800);
  };

  const startMove = (dir) => {
    if (!cameraRef.current) return;
    const direction = new THREE.Vector3();
    const lateral = new THREE.Vector3();
    moveInterval.current = setInterval(() => {
      cameraRef.current.getWorldDirection(direction);
      direction.normalize();
      lateral.crossVectors(direction, cameraRef.current.up).normalize();
      if (dir === 'forward') cameraRef.current.position.addScaledVector(direction, 1);
      else if (dir === 'backward') cameraRef.current.position.addScaledVector(direction, -1);
    }, 16);
  };

  const stopMove = () => clearInterval(moveInterval.current);

  const handleButtonTouch = (direction) => {
    if (firstInteraction) {
      setFirstInteraction(false);
      setTexteExplicatif('Maintenez enfoncé la flèche de haut ou de bas pour avancer ou reculer');
      setShowTexte(true);
      setTimeout(() => setShowTexte(false), 5000);
    }
    startMove(direction);
  };

  const shouldHideControls = modalInfo || showUI;

  return (
    <div style={containerStyle}>
      <div style={{ ...styles.texteScene, opacity: showTexte ? 1 : 0 }}>{texteExplicatif}</div>

      <Canvas camera={{ position: [0, 0, 0.1], fov: zoomLevel }} onCreated={({ camera }) => (cameraRef.current = camera)}>
        <ambientLight />
        <Suspense fallback={null}>
          <group>
            <meshBasicMaterial transparent opacity={sceneOpacity} />
            <Panorama texturePath={`/images/${scene}.jpg`} />
            <Hotspot position={[0, 0, -100]} onClick={() => {scene!='scene7' ? switchScene('scene'+(parseInt(scene[5])+1)) : alert('Fin de la visite du PARC NATIONAL DE WAZA.')}} label="➡️ Vers autre scène" />
            {scene === 'scene1' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Statue 3D',
                  description: 'Une belle sculpture interactive.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
            {scene === 'scene2' && (
              <InteractiveModel
                path="/models/object2.glb"
                position={[-80, 0, -150]}
                info={{
                  title: 'Objet archéologique',
                  description: 'Une découverte historique en 3D.',
                  image: '/info/info2.jpg',
                  video: '/videos/v1.mp4'
                }}
                onClick={setModalInfo}
              />
            )}
              {scene === 'scene3' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Statue 3D',
                  description: 'Une belle sculpture interactive.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
              {scene === 'scene4' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Statue 3D',
                  description: 'Une belle sculpture interactive.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
              {scene === 'scene5' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Statue 3D',
                  description: 'Une belle sculpture interactive.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
              {scene === 'scene6' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Statue 3D',
                  description: 'Une belle sculpture interactive.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
              {scene === 'scene7' && (
              <InteractiveModel
                path="/models/object1.glb"
                position={[50, -10, -100]}
                info={{
                  title: 'Éland de Derby',
                  description: 'Éland de Derby. L\'une des rares espèces en voie de disparition existante encore seulement au Cameroun, en RCA et au Tchad.',
                  image: '/info/info1.jpg',
                  video: ''
                }}
                onClick={setModalInfo}
              />
            )}
             
            <CameraMover zoomLevel={zoomLevel} />
          </group>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Bouton menu ⋮ */}
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1002 }}>
        <button onClick={() => setShowDropdown(!showDropdown)} style={styles.menuButton}>⋮</button>
        {showDropdown && (
          <div style={styles.menuContent}>
            <a style={styles.menuItem} onClick={() => { setShowUI(!showUI); setShowDropdown(false); }}>
              {showUI ? 'Fermer la communauté' : 'Ouvrir la communauté'}
            </a>
            <a href="https://easy-tourism.foichretienne.org/login" style={{color:'blue!important'}}><span style={styles.menuItem}>Se connecter</span></a>
            <a href="https://easy-tourism.foichretienne.org" style={{color:'blue!important',paddingTop:'10px'}}><span style={styles.menuItem}>Quitter la visite</span></a>
          </div>
        )}
      </div>

      {/* UI Communauté */}
      {showUI && (
        <div style={styles.ui}>
          <button onClick={() => setShowUI(false)} style={modalStyles.close}>✕</button>
          <div style={styles.slider}>
            <label style={{color:'black'}}>Zoom ({zoomLevel})</label>
            <input type="range" min="30" max="90" value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value))} />
          </div>
          <div style={styles.actions}>
            <button style={styles.iconButton} onClick={() => setLiked(!liked)}>❤️ {liked ? 'Aimé' : 'Like'}(10)</button>
            <button style={styles.iconButton} onClick={() => setShareOpen(true)}>📤 Partager(5)</button>
            <button style={styles.iconButton} onClick={() => setCommentsOpen(true)}>💬 Commentaires(200)</button>
            <span style={{ fontSize: 'small', color: '#444' }}>👁️ {views} vues</span>
          </div>
        </div>
      )}

      <div style={styles.menu}>
        <button onClick={() => setShowMenu(!showMenu)} style={styles.menuButton}>≡</button>
        {showMenu && (
          <div style={styles.menuContent}>
            <ul>
              <li style={scene === 'scene1' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene1'); setShowMenu(false); }}>Accueil</li>
              <li style={scene === 'scene2' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene2'); setShowMenu(false); }}>L'éléphant</li>
               <li style={scene === 'scene3' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene3'); setShowMenu(false); }}>Le lion</li>
              <li style={scene === 'scene4' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene4'); setShowMenu(false); }}>La jirafe</li>
               <li style={scene === 'scene5' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene5'); setShowMenu(false); }}>La lionne</li>
              <li style={scene === 'scene6' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene6'); setShowMenu(false); }}>Le python</li>
               <li style={scene === 'scene7' ? styles.menuItemActive : styles.menuItem} onClick={() => { switchScene('scene7'); setShowMenu(false); }}>L'Éland de Derby</li>
            </ul>
          </div>
        )}
      </div>

      {modalInfo && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.modal}>
            <button style={modalStyles.close} onClick={() => setModalInfo(null)}>✕</button>
            <h2 style={modalStyles.title}>{modalInfo.title}</h2>
            {modalInfo.image && <img src={modalInfo.image} alt={modalInfo.title} style={modalStyles.image} />}
            {modalInfo.video && <video controls src={modalInfo.video} style={modalStyles.image} />}
            <p style={modalStyles.description}>{modalInfo.description}</p>
          </div>
        </div>
      )}

      {shareOpen && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.modal}>
            <button style={modalStyles.close} onClick={() => setShareOpen(false)}>✕</button>
            <h2 style={modalStyles.title}>Partager cette visite</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="https://facebook.com/sharer/sharer.php?u=https://tonsite.com" target="_blank">🌐 Facebook</a>
              <a href="https://twitter.com/intent/tweet?url=https://tonsite.com" target="_blank">🐦 Twitter</a>
              <a href="https://wa.me/?text=https://tonsite.com" target="_blank">📱 WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {commentsOpen && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.modal}>
            <button style={modalStyles.close} onClick={() => setCommentsOpen(false)}>✕</button>
            <h2 style={modalStyles.title}>Commentaires</h2>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
              <p style={{ color:'black'}}>💬 <span style={{fontWeight:'bold'}}>Jean</span> : Très belle scène Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis pariatur neque quae voluptates corporis, labore debitis ea veritatis voluptatum quam error ipsam nobis! Quo cupiditate voluptas fuga quod excepturi aperiam. !</p>
              <p style={{ color:'black'}}>💬 <span style={{fontWeight:'bold'}}>Marie</span> : Impressionnant Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore fuga dolore voluptatum ex temporibus sapiente, alias iure velit eveniet sed molestiae laborum rem quia delectus dignissimos, reiciendis ipsa? Esse, iste. !</p>
            </div>
            <textarea rows={4} placeholder="Ajouter un commentaire..." style={{ width: '90%', borderRadius: '8px', padding: '10px' }} />
            <button style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', borderRadius: '8px', border: 'none' }}>
              Publier
            </button>
          </div>
        </div>
      )}

      {!shouldHideControls && (
        <div style={styles.fixedControls}>
        <span style={{display:'flex', flexDirection:'column',gap:'5px'}}>
 <button
            onMouseDown={() => handleButtonTouch('forward')}
            onMouseUp={stopMove}
            onTouchStart={() => handleButtonTouch('forward')}
            onTouchEnd={stopMove}
            style={styles.controlButton}
          >
          </button>
            <span style={{color:'white',background:'rgba(0, 0, 0, 0.5)', padding:'2px',paddingLeft:'5px',paddingRight:'5px'}}>Avancer</span>
        </span>
          <span style={{display:'flex', flexDirection:'column',gap:'5px'}}>
            <button
            onMouseDown={() => handleButtonTouch('backward')}
            onMouseUp={stopMove}
            onTouchStart={() => handleButtonTouch('backward')}
            onTouchEnd={stopMove}
            style={styles.controlButton}
          >
            {/* <img src={bottomimg} style={{ height: '17px' }} alt="Reculer" /> */}
          </button>
          <span style={{color:'white',background:'rgba(0, 0, 0, 0.5)', padding:'2px',paddingLeft:'5px',paddingRight:'5px'}}>Reculer</span>
          </span>
        </div>
      )}
    </div>
  );
}

// --- Styles
const containerStyle = {
  height: '100dvh',
  width: '100vw',
  overflow: 'hidden',
  position: 'relative',
};

const styles = {
  ui: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    background: 'rgba(255,255,255,0.95)',
    padding: '12px 24px',
    borderRadius: '16px',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '95vw',
    width:'80%'
  },
  slider: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    fontSize:'small'
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    background: 'white',
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 'small',
    color:'black'
  },
  menu: {
    position: 'fixed',
    top: 11,
    left: 20,
    right:20,
    zIndex: 1001,
  },
  menuButton: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    border: 'none',
    marginTop:'20px',
    display:'flex',
    flexDirection:'row',
    alignItems:'start'
  },
  menuContent: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    marginTop: '5px',
    display:'flex',
    flexDirection:'column',
    alignItems:'start',
    justifyContent:'center',
    width:'max-content'
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    fontSize: 'small',
    borderBottom: '1px solid #ccc',
    color:'black'
  },
  menuItemActive: {
    padding: '10px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    borderBottom: '1px solid #007bff',
    color: '#007bff',
    background: '#e0f7fa',
  },
  fixedControls: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1001,
    display: 'flex',
    gap: '20px',
    marginBottom: '80px',
  },
  controlButton: {
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid #ddd',
    borderRadius: '50%',
    padding: '15px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    color:'black',
    width:'60px',
    height:'60px'
  },
  texteScene: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.75)',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: 'small',
    maxWidth: '90%',
    zIndex: 1000,
    textAlign: 'center',
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
  }
};

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    pointerEvents: 'auto',
    color:'black'
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 2001,
    position: 'relative',
    color:'black'
  },
  close: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color:'black'
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: '10px',
    color:'black'
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.5',
     color:'black'
  },
};
