import React from 'react';

interface FormLoadingOverlayProps {
  visible: boolean;
}

export const FormLoadingOverlay: React.FC<FormLoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="form-loader" role="status" aria-live="polite" aria-label="Cargando formulario">
      <div className="form-loader__content">
        <div className="content" aria-hidden="true">
          <div className="pill">
            <div className="medicine">
              {Array.from({ length: 20 }, (_, index) => <i key={index} />)}
            </div>
            <div className="side" />
            <div className="side" />
          </div>
        </div>
        <p>Cargando formulario</p>
      </div>
    </div>
  );
};