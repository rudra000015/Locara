'use client';

import React, { useState, useEffect } from 'react';
import IntroScreen from '@/components/intro/IntroScreen';
import AuthScreen from '@/components/auth/AuthScreen';
import FancyShutter from '@/components/ui/ShopShutter';
import TextPortal from '@/components/ui/TextPortal'; 
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import IntroBanner from '@/components/ui/IntroBanner';
export default function Home() {
  const user = useStore(s => s.user);
  const role = useStore(s => s.role);
  const router = useRouter();
  
  const [introFinished, setIntroFinished] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  // Initial Redirection (if already logged in)
  useEffect(() => {
    if (user && !showPortal) {
      router.push(role === 'owner' ? '/owner' : '/explorer');
    }
  }, [user, role, router, showPortal]);

  return (
    <>
      <FancyShutter>
        <div className="relative min-h-screen">
          {/* 1. Video Intro plays first */}
          {!introFinished && (
            <IntroScreen onFinish={() => setIntroFinished(true)} />
          )}

          {/* 2. Login appears only after Intro ends */}
          {introFinished && !user && (
            <AuthScreen onLoginSuccess={() => setShowPortal(true)} />
          )}
        </div>
      </FancyShutter>

      {/* 3. Text Portal triggers after successful login */}
      <TextPortal 
        show={showPortal} 
        onComplete={() => router.push(role === 'owner' ? '/owner' : '/explorer')} 
      />
      <IntroBanner />
    </>
  );
}