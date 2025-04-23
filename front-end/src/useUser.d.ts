// filepath: /Users/marygracezabala/Documents/React Full Stack/front-end/src/useUser.d.ts
import { User as FirebaseUser } from 'firebase/auth';

declare function useUser(): {
  isLoading: boolean;
  user: FirebaseUser | null;
};

export default useUser;