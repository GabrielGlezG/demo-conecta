import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, Button, Accordion, Image, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const EXCLUDED_FIELDS = new Set([
  '_id', 'formhub/uuid', '_xform_id_string', '_uuid', '_attachments',
  '_status', '_geolocation', '_tags', '_notes', '_validation_status',
  '_submitted_by', 'start', 'end', '__version__', 'meta/instanceID',
  '_submission_time', 'meta/rootUuid', 'meta/deprecatedID'
]);

const BackButton = ({ onClick, text }) => (
  <Button variant="link" onClick={onClick} className="text-decoration-none p-0">
    <ArrowLeft /> {text}
  </Button>
);

const MapComponent = ({ lat, lon }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const coordinates = fromLonLat([lon, lat]);

    if (!mapInstance.current) {
      const marker = new Feature({ geometry: new Point(coordinates) });
      marker.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.03
        })
      }));

      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features: [marker] })
      });

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer
        ],
        view: new View({ center: coordinates, zoom: 15 })
      });
    } else {
      mapInstance.current.getView().setCenter(coordinates);
    }
  }, [lat, lon]);

  return <div ref={mapRef} style={{ height: '200px', width: '100%', marginTop: '10px' }}></div>;
};

const renderValue = (key, value, response) => {
  if (value == null) return 'No respondido';
  key = key.split('/').pop().replace(/_/g, ' '); // Eliminar prefijos de grupo

  if (key === 'temperatura operacion' && Number(value) > 100) {
    return <Alert variant="warning"><strong>⚠ Advertencia:</strong> La temperatura de operación es alta ({value}°C)</Alert>;
  }

  if (typeof value === 'string' && /\.(png|jpe?g)$/i.test(value)) {
    const attachment = response._attachments?.find(att => att.question_xpath.endsWith(key.replace(/ /g, '_')));
    if (attachment) {
      return (
        <div className="mt-2">
          <Image 
            src={`http://localhost:5000/api/image-proxy?url=${encodeURIComponent(attachment.download_url)}`} 
            alt={key} 
            thumbnail
            style={{ maxWidth: '150px', maxHeight: '150px' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <br />
          <a href={attachment.download_url} target="_blank" rel="noopener noreferrer">Ver imagen completa</a>
        </div>
      );
    }
  }

  if (key.toLowerCase().includes('ubicacion') && typeof value === 'string') {
    const [lat, lon] = value.split(' ').map(Number);
    if (!isNaN(lat) && !isNaN(lon)) return <MapComponent lat={lat} lon={lon} />;
  }

  return Array.isArray(value) ? value.join(', ') : String(value);
};

const SurveyResponses = ({ surveys, onBack }) => {
  const [view, setView] = useState('summary');
  const [selectedDate, setSelectedDate] = useState(null);

  const groupedResponses = useMemo(() => {
    return surveys.reduce((acc, survey) => {
      const date = new Date(survey._submission_time).toLocaleDateString();
      (acc[date] = acc[date] || []).push(survey);
      return acc;
    }, {});
  }, [surveys]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <BackButton onClick={onBack} text="Volver a reportes" />
        <h4 className="mt-3">Reporte Subestación</h4>
      </div>
      {view === 'summary' ? (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Resumen de reporte</h5>
            <span className="badge bg-primary">{surveys.length} total</span>
          </Card.Header>
          <Card.Body>
            {Object.entries(groupedResponses).map(([date, responses]) => (
              <div key={date} className="list-group-item">
                <h6>{date} <small className="text-muted">({responses.length} reporte{responses.length !== 1 ? 's' : ''})</small></h6>
                <Button variant="outline-primary" size="sm" onClick={() => { setView('detail'); setSelectedDate(date); }}>Ver reporte</Button>
              </div>
            ))}
          </Card.Body>
        </Card>
      ) : (
        <div>
          <BackButton onClick={() => { setView('summary'); setSelectedDate(null); }} text="Volver al resumen" />
          <Accordion>
            {groupedResponses[selectedDate]?.map((response, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>
                  <span className="fw-bold text-dark">{index + 1}. {response['group_kk9gr98/inspector_responsable'] || "Sin nombre"}</span>
                </Accordion.Header>
                <Accordion.Body>
                  {Object.entries(response).filter(([key]) => !EXCLUDED_FIELDS.has(key)).map(([key, value]) => (
                    <div key={key} className="mb-3 border-bottom pb-3">
                      <div className="fw-medium text-primary mb-2">{key.split('/').pop().replace(/_/g, ' ')}</div>
                      <div className="ps-3">{renderValue(key, value, response)}</div>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
