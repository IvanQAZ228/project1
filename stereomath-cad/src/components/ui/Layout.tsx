import { ReactNode } from 'react';
import { Toolbar } from './Toolbar';
import { ObjectTree } from './ObjectTree';
import { PropertiesPanel } from './PropertiesPanel';
import { MobileSheet } from './MobileSheet';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50 flex flex-col relative font-sans text-slate-900 select-none">
      <Toolbar />
      <ObjectTree />
      <PropertiesPanel />

      <main className="flex-1 w-full h-full relative">
        {children}
      </main>

      <MobileSheet />
    </div>
  );
};