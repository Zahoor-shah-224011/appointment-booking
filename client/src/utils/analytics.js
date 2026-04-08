import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  ReactGA.initialize(measurementId);
};

export const sendPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const sendEvent = (action, category, label) => {
  ReactGA.event({
    action,
    category,
    label,
  });
};