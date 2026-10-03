from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
PORT = 8765

class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        raw = super().translate_path(path)
        rel = os.path.relpath(raw, os.getcwd())
        return str(ROOT / rel)

    def do_GET(self):
        path_only = self.path.split('?', 1)[0]
        target = ROOT / path_only.lstrip('/')
        if path_only != '/' and not target.exists() and '.' not in target.name:
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, fmt, *args):
        print(fmt % args)

if __name__ == '__main__':
    os.chdir(ROOT)
    url = f'http://127.0.0.1:{PORT}/'
    print(f'Myeonyeokryeok local server: {url}')
    try:
        webbrowser.open(url)
    except Exception:
        pass
    ThreadingHTTPServer(('127.0.0.1', PORT), SpaHandler).serve_forever()
