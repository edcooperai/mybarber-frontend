import { useEffect } from 'react';
import { APP_NAME } from '../constants/app';

export const setPageTitle = (title?: string) => {
  document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
};

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle();
  }, [title]);
};