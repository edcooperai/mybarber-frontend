import { useEffect } from 'react';

export const setPageTitle = (title: string) => {
  const baseTitle = 'MyBarber.ai';
  document.title = title ? `${title} | ${baseTitle}` : baseTitle;
};

export const usePageTitle = (title: string) => {
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle('');
  }, [title]);
};