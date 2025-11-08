# 🔧 Fix "localhost refused to connect" Error

## Quick Fixes

### Fix 1: Start the Server
The error means Next.js isn't running. Start it:

```bash
npm run dev
```

Wait 30-60 seconds, then try http://localhost:3000 again.

---

### Fix 2: Check if Server is Running
Open a new terminal and check:

```bash
# Windows PowerShell
netstat -ano | findstr ":3000"

# If you see output, server is running
# If no output, server is NOT running
```

---

### Fix 3: Kill Old Processes
Sometimes old Node processes block the port:

**Windows:**
```powershell
# Kill all Node processes
Get-Process -Name "node" | Stop-Process -Force

# Then start fresh
npm run dev
```

---

### Fix 4: Check for Errors
Look at the terminal where you ran `npm run dev`:
- ❌ **Red errors** = Something is wrong
- ✅ **"Ready" message** = Server is running
- ⏳ **Still compiling** = Wait a bit longer

---

### Fix 5: Try Different Port
If port 3000 is blocked:

```bash
npm run dev -- -p 3001
```

Then visit: http://localhost:3001

---

### Fix 6: Reinstall Dependencies
If nothing works:

```bash
# Delete node_modules
rmdir /s node_modules

# Reinstall
npm install

# Start server
npm run dev
```

---

## Common Causes

### ❌ Server Not Started
**Symptom:** "Connection refused"  
**Fix:** Run `npm run dev` and wait for "Ready" message

### ❌ Wrong Port
**Symptom:** Trying port 3000 but server on different port  
**Fix:** Check terminal output for actual port number

### ❌ Port Already in Use
**Symptom:** "Port 3000 is already in use"  
**Fix:** Kill process using port 3000, or use different port

### ❌ Firewall Blocking
**Symptom:** Server running but can't connect  
**Fix:** Check Windows Firewall settings

### ❌ Dependencies Not Installed
**Symptom:** Errors when starting  
**Fix:** Run `npm install` first

---

## Step-by-Step Troubleshooting

### Step 1: Verify You're in Right Directory
```bash
# Should see package.json
dir package.json

# If not found, navigate to project folder
cd C:\Users\shana\OneDrive\Desktop\ZIPPED
```

### Step 2: Check Node.js is Installed
```bash
node --version
npm --version

# Should show version numbers
```

### Step 3: Install Dependencies (if needed)
```bash
npm install
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Wait for Ready Message
Look for:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### Step 6: Open Browser
Visit: http://localhost:3000

---

## Still Not Working?

### Check Terminal Output
The terminal running `npm run dev` will show errors. Common issues:

1. **"Cannot find module"**
   - Run: `npm install`

2. **"Port 3000 already in use"**
   - Kill process: `Get-Process -Name "node" | Stop-Process -Force`
   - Or use different port: `npm run dev -- -p 3001`

3. **"EADDRINUSE"**
   - Port is taken, use different port

4. **Syntax errors**
   - Check the file mentioned in error
   - Fix the syntax error

### Check Browser Console
Press F12 in browser, check Console tab for errors.

### Try These URLs
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:3001 (if using different port)

---

## Quick Checklist

- [ ] Node.js installed? (`node --version`)
- [ ] In correct directory? (`package.json` exists)
- [ ] Dependencies installed? (`node_modules` folder exists)
- [ ] Server started? (`npm run dev` running)
- [ ] "Ready" message shown?
- [ ] Waiting 30-60 seconds after start?
- [ ] Trying correct URL? (http://localhost:3000)
- [ ] No firewall blocking?
- [ ] No other app using port 3000?

---

## Emergency Reset

If nothing works, try this complete reset:

```bash
# 1. Stop all Node processes
Get-Process -Name "node" | Stop-Process -Force

# 2. Delete node_modules and lock file
rmdir /s node_modules
del package-lock.json

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Start fresh
npm run dev
```

---

## Need More Help?

1. Check the terminal running `npm run dev` for error messages
2. Check browser console (F12) for errors
3. Verify Node.js version: `node --version` (should be 18+)
4. Make sure you're in the project directory

