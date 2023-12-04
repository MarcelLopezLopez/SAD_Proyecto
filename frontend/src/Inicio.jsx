import React, { useState } from 'react';
import CrearPartida from './CrearPartida';
import UnirsePartida from './UnirsePartida';
import './Inicio.css'; // Asegúrate de cambiar el nombre del archivo según sea necesario

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [idPartida, setIdPartida] = useState('');
  const [pantalla, setPantalla] = useState('inicio');
  const [identificadorPartida, setIdentificadorPartida] = useState('');
  const [iniciarPartida, setIniciarPartida] = useState(false);

  const handleCrearPartida = async () => {
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de crear la partida.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/partida/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario: nombre }),
      });

      if (response.ok) {
        const identificadorGenerado = await response.text();
        setIdentificadorPartida(identificadorGenerado);
        setIniciarPartida(false);
        setPantalla('crearPartida');
      } else {
        console.error('Error al crear la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleUnirsePartida = async () => {
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de unirte a la partida.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/partida/unirse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          identificador: idPartida,
        }),
      });

      if (response.ok) {
        const estadoPartida = await response.text();
        console.log('Estado de la partida:', estadoPartida);
        setIniciarPartida(true);
        setPantalla('unirsePartida');
      } else {
        console.error('Error al unirse a la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleIniciarPartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificador: identificadorPartida,
          nombreUsuario: nombre,
        }),
      });

      if (response.ok) {
        console.log('Partida iniciada!');
      } else {
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const renderPantallaActual = () => {
    switch (pantalla) {
      case 'crearPartida':
        return (
          <div className="container">
            <CrearPartida identificadorPartida={identificadorPartida} nombreUsuario={nombre} />
            {iniciarPartida && (
              <button onClick={handleIniciarPartida}>Iniciar Partida</button>
            )}
          </div>
        );
      case 'unirsePartida':
        return (
          <div className="container">
            <UnirsePartida nombreUsuario={nombre} />
          </div>
        );
      default:
        return (
          <div className="container">
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <hr />
            <label>
              ID de Partida para Unirse:
              <input type="text" value={idPartida} onChange={(e) => setIdPartida(e.target.value)} />
            </label>
            <button onClick={handleCrearPartida}>Crear Partida</button>
            <button onClick={handleUnirsePartida}>Unirse a Partida</button>
          </div>
        );
    }
  };

  return (
    <div>
      {renderPantallaActual()}
    </div>
  );
};

export default Inicio;
