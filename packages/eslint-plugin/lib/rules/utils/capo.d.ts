declare module "@rviscomi/capo.js" {
  export interface WeightInfo {
    element: any;
    weight: number;
    category: string;
  }

  export interface OrderingViolation {
    index: number;
    currentElement: any;
    nextElement: any;
    currentWeight: number;
    nextWeight: number;
    currentCategory: string;
    nextCategory: string;
    message: string;
  }

  export interface ValidationWarning {
    warning: string;
    element?: any | any[];
    elements?: any[];
  }

  export interface CustomValidation {
    ruleId?: string;
    element: any;
    warnings: string[];
    payload?: any;
  }

  export interface AnalysisResult {
    weights: WeightInfo[];
    validationWarnings: ValidationWarning[];
    customValidations: CustomValidation[];
    headElement: any;
    orderingViolations?: OrderingViolation[];
  }

  export interface HTMLAdapter {
    isElement(node: any): boolean;
    getTagName(node: any): string;
    getAttribute(node: any, attrName: string): string | null;
    hasAttribute(node: any, attrName: string): boolean;
    getAttributeNames(node: any): string[];
    getTextContent(node: any): string;
    getChildren(node: any): any[];
    getParent(node: any): any | null;
    getSiblings(node: any): any[];
    getLocation?(node: any): {
      line: number;
      column: number;
      endLine?: number;
      endColumn?: number;
    } | null;
    stringify(node: any): string;
  }

  export function analyzeHead(
    headNode: any,
    adapter: HTMLAdapter,
    options?: {
      includeValidation?: boolean;
      includeCustomValidations?: boolean;
    }
  ): AnalysisResult;

  export function analyzeHeadWithOrdering(
    headNode: any,
    adapter: HTMLAdapter,
    options?: {
      includeValidation?: boolean;
      includeCustomValidations?: boolean;
    }
  ): AnalysisResult & { orderingViolations: OrderingViolation[] };

  export function checkOrdering(weights: WeightInfo[]): OrderingViolation[];
  export function getWeightCategory(weight: number): string;

  export const ElementWeights: {
    META: number;
    TITLE: number;
    PRECONNECT: number;
    ASYNC_SCRIPT: number;
    IMPORT_STYLES: number;
    SYNC_SCRIPT: number;
    SYNC_STYLES: number;
    PRELOAD: number;
    DEFER_SCRIPT: number;
    PREFETCH_PRERENDER: number;
    OTHER: number;
  };

  export function getWeight(element: any, adapter: HTMLAdapter): number;
  export function getHeadWeights(head: any, adapter: HTMLAdapter): WeightInfo[];

  export function isMeta(element: any, adapter: HTMLAdapter): boolean;
  export function isTitle(element: any, adapter: HTMLAdapter): boolean;
  export function isPreconnect(element: any, adapter: HTMLAdapter): boolean;
  export function isAsyncScript(element: any, adapter: HTMLAdapter): boolean;
  export function isImportStyles(element: any, adapter: HTMLAdapter): boolean;
  export function isSyncScript(element: any, adapter: HTMLAdapter): boolean;
  export function isSyncStyles(element: any, adapter: HTMLAdapter): boolean;
  export function isPreload(element: any, adapter: HTMLAdapter): boolean;
  export function isDeferScript(element: any, adapter: HTMLAdapter): boolean;
  export function isPrefetchPrerender(
    element: any,
    adapter: HTMLAdapter
  ): boolean;
  export function isOriginTrial(element: any, adapter: HTMLAdapter): boolean;
  export function isMetaCSP(element: any, adapter: HTMLAdapter): boolean;

  export const VALID_HEAD_ELEMENTS: string[];
  export function isValidElement(element: any, adapter: HTMLAdapter): boolean;
  export function hasValidationWarning(
    element: any,
    adapter: HTMLAdapter
  ): boolean;
  export function getValidationWarnings(
    head: any,
    adapter: HTMLAdapter
  ): ValidationWarning[];
  export function getCustomValidations(
    element: any,
    adapter: HTMLAdapter,
    head?: any
  ): CustomValidation | null;

  export class BrowserAdapter implements HTMLAdapter {
    isElement(node: any): boolean;
    getTagName(node: any): string;
    getAttribute(node: any, attrName: string): string | null;
    hasAttribute(node: any, attrName: string): boolean;
    getAttributeNames(node: any): string[];
    getTextContent(node: any): string;
    getChildren(node: any): any[];
    getParent(node: any): any | null;
    getSiblings(node: any): any[];
    getLocation(node: any): {
      line: number;
      column: number;
      endLine?: number;
      endColumn?: number;
    } | null;
    stringify(node: any): string;
  }

  export class AdapterInterface implements HTMLAdapter {
    isElement(node: any): boolean;
    getTagName(node: any): string;
    getAttribute(node: any, attrName: string): string | null;
    hasAttribute(node: any, attrName: string): boolean;
    getAttributeNames(node: any): string[];
    getTextContent(node: any): string;
    getChildren(node: any): any[];
    getParent(node: any): any | null;
    getSiblings(node: any): any[];
    getLocation(node: any): {
      line: number;
      column: number;
      endLine?: number;
      endColumn?: number;
    } | null;
    stringify(node: any): string;
  }

  export function validateAdapter(adapter: any): void;
}
