import { ReactNode } from 'react';
import { Toolbar } from './Toolbar';
import { ObjectTree } from './ObjectTree';
import { PropertiesPanel } from './PropertiesPanel';
import { MobileSheet } from './MobileSheet';
import { SketchGallery } from './SketchGallery';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50 flex flex-col relative font-sans text-slate-900 select-none">
      <Toolbar />
      <div className="flex flex-col gap-2 absolute top-20 left-4 z-10 hidden md:block">
         <ObjectTree />
         <SketchGallery />
      </div>
      <PropertiesPanel />

      <main className="flex-1 w-full h-full relative">
        {children}
      </main>

      <MobileSheet />
    </div>
  );
};