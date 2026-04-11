const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            const fixes = [
                { from: /to="\/"/g, to: 'to="/complaint"' },
                { from: /to="\/dashboard"/g, to: 'to="/complaint/dashboard"' },
                { from: /to="\/complaints"/g, to: 'to="/complaint/complaints"' },
                { from: /to="\/new"/g, to: 'to="/complaint/new"' },
                { from: /to="\/admin"/g, to: 'to="/complaint/admin"' },
                { from: /navigate\("\/"\)/g, to: 'navigate("/complaint")' },
                { from: /navigate\('\/'\)/g, to: 'navigate(\'/complaint\')' },
                { from: /navigate\("\/dashboard"\)/g, to: 'navigate("/complaint/dashboard")' },
                { from: /navigate\('\/dashboard'\)/g, to: 'navigate(\'/complaint/dashboard\')' },
                { from: /navigate\("\/complaints"\)/g, to: 'navigate("/complaint/complaints")' },
                { from: /navigate\('\/complaints'\)/g, to: 'navigate(\'/complaint/complaints\')' },
                { from: /navigate\("\/new"\)/g, to: 'navigate("/complaint/new")' },
                { from: /navigate\('\/new'\)/g, to: 'navigate(\'/complaint/new\')' }
            ];
            fixes.forEach(fix => {
                content = content.replace(fix.from, fix.to);
            });
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}

replaceInDir('c:/3Y2S Hostel managment/Frontend/src/components/complaints_module');
