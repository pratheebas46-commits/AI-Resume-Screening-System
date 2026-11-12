/**
 * ProtectedRoute — no-op for local/offline usage.
 * Authentication is handled by AuthContext which always returns authenticated.
 */

export default function ProtectedRoute({ children }) {
  return children;
}
