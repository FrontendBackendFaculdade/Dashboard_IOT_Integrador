/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Categoria`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Empilhado`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Sobre`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Temporal`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/Paginas/Categoria`; params?: Router.UnknownOutputParams; } | { pathname: `/Paginas/Empilhado`; params?: Router.UnknownOutputParams; } | { pathname: `/Paginas/Sobre`; params?: Router.UnknownOutputParams; } | { pathname: `/Paginas/Temporal`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/Paginas/Categoria${`?${string}` | `#${string}` | ''}` | `/Paginas/Empilhado${`?${string}` | `#${string}` | ''}` | `/Paginas/Sobre${`?${string}` | `#${string}` | ''}` | `/Paginas/Temporal${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Categoria`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Empilhado`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Sobre`; params?: Router.UnknownInputParams; } | { pathname: `/Paginas/Temporal`; params?: Router.UnknownInputParams; };
    }
  }
}
