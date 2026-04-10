import pty
import os
import time

pid, fd = pty.fork()
if pid == 0:
    os.execvp('npx', ['npx', 'surge', './dist', 'changsha-food-guide-525.surge.sh'])
else:
    buf = b''
    state = 0
    while True:
        try:
            chunk = os.read(fd, 1024)
            if not chunk:
                break
            buf += chunk
            text = chunk.decode('utf-8', 'replace')
            print(text, end='', flush=True)
            
            if state == 0 and b'email:' in buf:
                os.write(fd, b'changsha-food-525-auto@example.com\r')
                state = 1
                buf = b''
            elif state == 1 and b'password:' in buf:
                os.write(fd, b'autodeploy123456\r')
                state = 2
                buf = b''
        except OSError:
            break
    os.waitpid(pid, 0)
