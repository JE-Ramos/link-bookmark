/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as clearData from "../clearData.js";
import type * as clearTopics from "../clearTopics.js";
import type * as links from "../links.js";
import type * as seed from "../seed.js";
import type * as seedTopics from "../seedTopics.js";
import type * as setup from "../setup.js";
import type * as topics from "../topics.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  clearData: typeof clearData;
  clearTopics: typeof clearTopics;
  links: typeof links;
  seed: typeof seed;
  seedTopics: typeof seedTopics;
  setup: typeof setup;
  topics: typeof topics;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
