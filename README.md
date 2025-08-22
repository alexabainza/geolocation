# Geolocation Technical Assessment
## Installation
```https://github.com/alexabainza/geolocation.git```

## To set up frontend:
1. Navigate to front end folder:
```
cd geolocation-assessment
```

2. Install dependencies
```
npm install
```

3. In `config > environment.ts`, set the DEV_HOST variable to your own IP address.

4. Run `npx expo start`. Make sure you have the Expo Go app installed in your physical phone or emulator. When prompted, scan the QR code or input exp://{ip_address}:{port} which can be seen when you run `npx expo start`.

## To set up backend:
1. Navigate to the back end folder:
```
cd geolocation-backend
```

2. Install dependencies 
```
npm install
```

3. Set up environment variables by creating a .env file in the geolocation-backend folder. The contents of the .env file will be attached in the submission form.

4. Run `nodemon index.js`
