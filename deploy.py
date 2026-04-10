import pty
import os
import time

def read_until(fd, expected):
    buf = b''
    while True:
        try:
            chunk = os.read(fd, 1024)
        except OSError:
            break
        if not chunk:
            break
        buf += chunk
        print(chunk.decode('utf-8', 'replace'), end='', flush=True)
        if expected.encode('utf-8') in buf:
            return

pid, fd = pty.fork()
if pid == 0:
    os.execvp('npx', ['npx', 'surge', './dist', 'changsha-food-guide-525.surge.sh'])
else:
    read_until(fd, 'email:')
    os.write(fd, b'auto-deploy-525@example.com\n')
    time.sleep(1)
    read_until(fd, 'password:')
    os.write(fd, b'autodeploypassword123\n')
    time.sleep(1)
    # just read the rest
    while True:
        try:
            chunk = os.read(fd, 1024)
            if not chunk:
                break
            print(chunk.decode('utf-8', 'replace'), end='', flush=True)
        except OSError:
            break
    os.waitpid(pid, 0)
