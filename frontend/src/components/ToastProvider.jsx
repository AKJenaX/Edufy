import { Toaster } from 'react-hot-toast';

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        // Error
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

export default ToastProvider;

// Made with Bob
