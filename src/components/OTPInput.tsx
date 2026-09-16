import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { showAlert } from '../utils/alerts';

interface OTPInputProps {
  onSuccess?: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ onSuccess }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Generar un código aleatorio al montar para pruebas
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Mover al siguiente input automáticamente
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Verificar si está completo
    const combined = newCode.join('');
    if (combined.length === 6) {
      if (combined === generatedOtp) {
        showAlert.success('Código verificado', 'El código ingresado es correcto 🎉');
        if (onSuccess) onSuccess();
      } else {
        showAlert.error('Error', 'El código es incorrecto. Intenta nuevamente.');
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Mover al input anterior en Backspace si está vacío
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      if (pastedData.length < 6) {
        inputRefs.current[pastedData.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
        if (pastedData === generatedOtp) {
          showAlert.success('Código verificado', 'El código ingresado es correcto 🎉');
          if (onSuccess) onSuccess();
        } else {
          showAlert.error('Error', 'El código es incorrecto. Intenta nuevamente.');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.1rem' }}>Verificación 2FA (Prueba)</h3>
      <p style={{ color: '#9fadbc', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
        Ingresa el código de 6 dígitos enviado a tu correo.
      </p>

      <div style={{ display: 'flex', gap: '8px' }} onPaste={handlePaste}>
        {code.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            initial={{ scale: 1 }}
            whileFocus={{ scale: 1.1, borderColor: '#3b82f6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
            style={{
              width: '45px',
              height: '55px',
              fontSize: '1.5rem',
              textAlign: 'center',
              borderRadius: '8px',
              background: '#0f1115',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        ))}
      </div>

      <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed #3b82f6', borderRadius: '8px', color: '#60a5fa', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
        <span style={{ display: 'block', marginBottom: '4px', opacity: 0.8 }}>Código generado para pruebas:</span>
        <strong style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>{generatedOtp}</strong>
      </div>
    </div>
  );
};
