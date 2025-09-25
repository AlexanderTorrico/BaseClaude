// ==========================================
// USER DEBUGGER - DEBUGGING COMPONENT
// ==========================================

import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Alert } from 'reactstrap';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserDisplayName,
  selectLastLogin
} from '../slices';
import { useUserAuth } from '../hooks/useUserAuth';
import { getUserFromStorage } from '../services/storageService';

export const UserDebugger: React.FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const userDisplayName = useSelector(selectUserDisplayName);
  const lastLogin = useSelector(selectLastLogin);

  const { initializeAuth } = useUserAuth();

  const handleCheckStorage = async () => {
    const result = await getUserFromStorage();
    console.log('🔍 Storage Check Result:', result);
    alert(`Storage Result: ${JSON.stringify(result, null, 2)}`);
  };

  const handleInitializeAuth = async () => {
    const result = await initializeAuth();
    console.log('🔄 Initialize Auth Result:', result);
    alert(`Initialize Result: ${JSON.stringify(result, null, 2)}`);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h5>🔍 User State Debugger</h5>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert color="danger">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {isLoading && (
          <Alert color="info">
            <strong>Loading...</strong> Authentication in progress
          </Alert>
        )}

        <div className="mb-3">
          <h6>Redux State:</h6>
          <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify({
              isAuthenticated,
              user: user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                token: user.token ? `${user.token.substring(0, 20)}...` : null
              } : null,
              userDisplayName,
              lastLogin,
              isLoading,
              error
            }, null, 2)}
          </pre>
        </div>

        <div className="mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={handleCheckStorage}
          >
            🔍 Check Storage
          </button>
          <button
            className="btn btn-success me-2"
            onClick={handleInitializeAuth}
          >
            🔄 Initialize Auth
          </button>
          <button
            className="btn btn-info"
            onClick={() => {
              console.log('🏪 LocalStorage contents:');
              console.log('authUser:', localStorage.getItem('authUser'));
              console.log('authToken:', localStorage.getItem('authToken'));
              console.log('lastLogin:', localStorage.getItem('lastLogin'));
            }}
          >
            🏪 Log Storage
          </button>
        </div>

        <div className="text-muted" style={{ fontSize: '12px' }}>
          <strong>Instructions:</strong><br/>
          1. Click "Check Storage" to see what's in localStorage<br/>
          2. Click "Initialize Auth" to manually trigger auth initialization<br/>
          3. Check browser console for detailed logs
        </div>
      </CardBody>
    </Card>
  );
};