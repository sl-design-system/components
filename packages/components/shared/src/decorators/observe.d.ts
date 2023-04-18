import type { ReactiveElement } from 'lit';
import type { ClassElement } from './base.js';
type ObserveLifecycle = 'update' | 'updated';
export declare function observe(propertyName: string, lifecycle?: ObserveLifecycle): (target: ReactiveElement | ClassElement, methodName: string) => void;
export {};
