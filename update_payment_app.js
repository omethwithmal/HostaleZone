const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Backend', '..', 'Frontend', 'src', 'PaymentApp.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// replace absolute paths
content = content.replace(/'\/login'/g, "'/payment/login'");
content = content.replace(/'\/register'/g, "'/payment/register'");
content = content.replace(/'\/student\//g, "'/payment/student/");
content = content.replace(/'\/admin\//g, "'/payment/admin/");

// also in pageMeta keys
content = content.replace(/'\/student\/dashboard':/g, "'/payment/student/dashboard':");
content = content.replace(/'\/student\/submit-payment':/g, "'/payment/student/submit-payment':");
content = content.replace(/'\/student\/history':/g, "'/payment/student/history':");
content = content.replace(/'\/student\/notifications':/g, "'/payment/student/notifications':");
content = content.replace(/'\/admin\/dashboard':/g, "'/payment/admin/dashboard':");
content = content.replace(/'\/admin\/fees':/g, "'/payment/admin/fees':");
content = content.replace(/'\/admin\/verifications':/g, "'/payment/admin/verifications':");
content = content.replace(/'\/admin\/notifications':/g, "'/payment/admin/notifications':");

// Remove BrowserRouter
content = content.replace(/<BrowserRouter[\s\S]*?>/g, '<>');
content = content.replace(/<\/BrowserRouter>/g, '</>');
content = content.replace(/import \{[\s\S]*?BrowserRouter,[\s\S]*?\} from 'react-router-dom';/g, (match) => {
    return match.replace(/BrowserRouter,/, '');
});

// Rename `path="/student/*"` to `path="/student/*"` (already done when we prefix the main Route)
// Actually we need to change `<Route path="/login"` to `<Route path="/login"` etc?
// Wait, if we mount `PaymentApp` at `/payment/*`, inside `PaymentApp` the routes should match the remaining URL, which is `/login` etc.
// No, if we mount `PaymentApp` as an element, its `Routes` are relative to exactly where it's mounted.
// In v6, `Routes` inside a `*` route will match relative path.
// So if main is `<Route path="/payment/*" element={<PaymentApp />} />`,
// then inside `PaymentApp.jsx`, `<Route path="/login" />` will match `/payment/login`.
// But `<Navigate to="/payment/login" />` uses absolute URL, which is correct!
// Therefore, we don't need to change `path="/login"` inside `<Route>`, because it's relative to `/payment`.
// Wait, in React Router v6, absolute paths in `<Route path="/login">` inside a child `Routes` will error, or be treated relative to parent if they don't start with `/`. They SHOULD NOT start with `/` if they are relative, or if they start with `/` they match absolute.
// Actually, it's safer to just change `<Route path="/login"` to `<Route path="login"`, and `<Route path="/register"` to `<Route path="register"`, and `/student/*` to `student/*`, etc.

content = content.replace(/path="\/login"/g, 'path="login"');
content = content.replace(/path="\/register"/g, 'path="register"');
content = content.replace(/path="\/student\/\*"/g, 'path="student/*"');
content = content.replace(/path="\/admin\/\*"/g, 'path="admin/*"');
content = content.replace(/path="\/"/g, 'path="/"');

fs.writeFileSync(filePath, content);
console.log('PaymentApp.jsx updated');
