import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Panorama from './Panorama';
import Hotspot from './Hotspot';
import InteractiveModel from './InteractiveModel';
import CameraMover from './CameraMover';
import invisibleimg from '../public/constant/invisible.png'
import visibleimg from '../public/constant/visible.png'

export default function VirtualTour() {
  const [scene, setScene] = useState('scene1');
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
  const [firstInteraction, setFirstInteraction] = useState(true); // Pour savoir si c'est la première interaction
  const cameraRef = useRef();
  const moveInterval = useRef(null);

  // Texte explicatif par scène
  const textesParScene = {
    scene1: "Bienvenue dans la scène 1. Découvrez cette magnifique statue en 3D.",
    scene2: "Bienvenue dans la scène 2. Observez cet objet archéologique rare.",
  };

  useEffect(() => {
    setTexteExplicatif(textesParScene[scene]);
    setShowTexte(true);
    const timer = setTimeout(() => setShowTexte(false), 10000);
    return () => clearTimeout(timer);
  }, [scene]);

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
      setFirstInteraction(false); // Ne montre plus le message après la première interaction
      setTexteExplicatif('Maintenez enfoncé le bouton avancer ou reculer pour avancer ou reculer');
      setShowTexte(true);
      setTimeout(() => setShowTexte(false), 5000); // Le message disparaît après 5 secondes
    }
    startMove(direction);
  };

  const shouldHideControls = modalInfo || showUI;

  return (
    <div style={containerStyle}>
      {/* Texte explicatif */}
      <div
        style={{
          ...styles.texteScene,
          opacity: showTexte ? 1 : 0,
          pointerEvents: 'none', // Évite les clics
        }}
      >
        {texteExplicatif}
      </div>

      <Canvas
        camera={{ position: [0, 0, 0.1], fov: zoomLevel }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <ambientLight />
        <Suspense fallback={null}>
          <Panorama texturePath={`/images/${scene}.jpg`} />
          <Hotspot
            position={[0, 0, -100]}
            onClick={() => setScene(scene === 'scene1' ? 'scene2' : 'scene1')}
            label="➡️ Vers autre scène"
          />
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
          <CameraMover zoomLevel={zoomLevel} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      

      <button onClick={() => setShowUI(!showUI)} style={toggleButtonStyle}>
        <img style={{height:'20px',marginRight:'8px'}} src={showUI ? invisibleimg : visibleimg}/>
       <span> {showUI ? 'Communauté' : 'Communauté'}</span>
      </button>

      {showUI && (
        <div style={styles.ui}>
          <div style={styles.slider}>
            <label>Zoom ({zoomLevel})</label>
            <input
              type="range"
              min="30"
              max="90"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
            />
          </div>
          <div style={styles.actions}>
            <button style={styles.iconButton} onClick={() => setLiked(!liked)}>
              ❤️ {liked ? 'Aimé' : 'Like'}
            </button>
            <button style={styles.iconButton} onClick={() => setShareOpen(true)}>
              📤 Partager
            </button>
            <button style={styles.iconButton} onClick={() => setCommentsOpen(true)}>
              💬 Commentaires
            </button>
            <span style={{ fontSize: '1rem', color: '#444' }}>👁️ {views} vues</span>
          </div>
        </div>
      )}

      <div style={styles.menu}>
        <button onClick={() => setShowMenu(!showMenu)} style={styles.menuButton}>≡</button>
        {showMenu && (
          <div style={styles.menuContent}>
            <ul>
              <li style={scene === 'scene1' ? styles.menuItemActive : styles.menuItem} onClick={() => {setScene('scene1');setShowMenu(!showMenu)}}>Scene 1</li>
              <li style={scene === 'scene2' ? styles.menuItemActive : styles.menuItem} onClick={() => {setScene('scene2');setShowMenu(!showMenu)}}>Scene 2</li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal Info */}
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

      {/* Modal Share */}
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

      {/* Modal Comments */}
      {commentsOpen && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.modal}>
            <button style={modalStyles.close} onClick={() => setCommentsOpen(false)}>✕</button>
            <h2 style={modalStyles.title}>Commentaires</h2>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
              <p>💬 Jean : Très belle scène !</p>
              <p>💬 Marie : Impressionnant !</p>
            </div>
            <textarea rows={4} placeholder="Ajouter un commentaire..." style={{ width: '100%', borderRadius: '8px', padding: '10px' }} />
            <button style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', borderRadius: '8px', border: 'none' }}>
              Publier
            </button>
          </div>
        </div>
      )}

      {!shouldHideControls && (
        <div style={styles.fixedControls}>
          <button
            onMouseDown={() => handleButtonTouch('forward')}
            onMouseUp={stopMove}
            onTouchStart={() => handleButtonTouch('forward')}
            onTouchEnd={stopMove}
            style={styles.controlButton}
          >
            ⬆
          </button>
          <button
            onMouseDown={() => handleButtonTouch('backward')}
            onMouseUp={stopMove}
            onTouchStart={() => handleButtonTouch('backward')}
            onTouchEnd={stopMove}
            style={styles.controlButton}
          >
            ⬇
          </button>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  height: '100dvh',
  width: '100vw',
  overflow: 'hidden',
  position: 'relative',
};

// Autres styles inchangés...


const toggleButtonStyle = {
  position: 'fixed',
  top: 10,
  right: 10,
  zIndex: 1001,
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  display:'flex',
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center'
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
  },
  slider: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
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
    fontSize: '1.2rem',
  },
  menu: {
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1001,
  },
  menuButton: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  menuContent: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    borderBottom: '1px solid #ccc',
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
  },

  // Texte explicatif
  texteScene: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.75)',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '1.1rem',
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
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    pointerEvents: 'auto',
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 2001, // Important
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.5',
  },
};

