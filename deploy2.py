import pty
import os
import time

pid, fd = pty.fork()
if pid == 0:
    os.execvp('npx', ['npx', 'surge', './dist', 'changsha-food-guide-525.surge.sh'])
else:
    def wait_for(text):
        buf = b''
        while True:
            chunk = os.read(fd, 1024)
            buf += chunk
            print(chunk.decode('utf-8', 'replace'), end='', flush=True)
            if text.encode('utf-8') in buf:
                return

    wait_for('email:')
    os.write(fd, b'changsha-food-525-auto@example.com\n')
    time.sleep(1)
    wait_for('password:')
    os.write(fd, b'autodeploy123456\n')
    time.sleep(1)
    
    # Check if it asks for password again or something else
    while True:
        try:
            chunk = os.read(fd, 1024)
            if not chunk:
                break
            text = chunk.decode('utf-8', 'replace')
            print(text, end='', flush=True)
            if 'password:' in text:
                os.write(fd, b'autodeploy123456\n')
        except OSError:
            break
    os.waitpid(pid, 0)
