const fs = require('fs'); 
let c = fs.readFileSync('src/views/auth/Login.tsx', 'utf-8'); 
c = c.replace("import './Auth.css';", "import { OTPInput } from '../../components/OTPInput';\nimport './Auth.css';"); 
c = c.replace(/<p className=\"auth-footer\">[\s\S]*?<\/p>/, `<p className=\"auth-footer\">\n          ¿No tienes cuenta? <Link to=\"/register\">Regístrate aquí</Link>\n        </p>\n\n        <div style={{ marginTop: '30px' }}>\n          <OTPInput />\n        </div>`); 
fs.writeFileSync('src/views/auth/Login.tsx', c);
