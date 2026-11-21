// Request and baseline contracts of the Mira Explorer content API.
import { z } from "zod";
import {
  publishedCategorySchema,
  publishedPersonSchema,
  publishedPoiDetailSchema,
  publishedPoiSummarySchema,
} from "./publishedContent.ts";

const generationSchema = z
  .object({
    provider: z.string().trim().min(1),
    model: z.string().trim().min(1),
    completedAt: z.iso.datetime(),
  })
  .strict();
export const wikipediaPageSchema = z
  .object({
    language: z.string().regex(/^[a-z][a-z0-9-]*$/),
    pageId: z.number().int().positive(),
    title: z.string().min(1),
    url: z.url(),
    wikidataId: z
      .string()
      .regex(/^Q[1-9]\d*$/)
      .optional(),
  })
  .strict();

export const personWriteSchema = z
  .object({
    profileVersion: z.uuid().toLowerCase(),
    wikidataId: z.string().regex(/^Q[1-9]\d*$/),
    person: publishedPersonSchema,
    generation: generationSchema,
  })
  .strict();

export const personUpdateSchema = personWriteSchema.extend({
  expectedProfileVersion: z.uuid().toLowerCase(),
});

const catalogPoiSchema = publishedPoiSummarySchema.omit({ city: true, categoryIds: true }).extend({
  wikidataId: z
    .string()
    .regex(/^Q[1-9]\d*$/)
    .optional(),
  osmIds: z.array(z.string().min(1)),
  wikipediaPages: z
    .array(wikipediaPageSchema)
    .refine(
      (pages) =>
        new Set(pages.map(({ language, pageId }) => `${language}:${pageId}`)).size === pages.length,
      { message: "Duplicate Wikipedia page identity." },
    ),
});

export const catalogBaselineSchema = z
  .object({
    city: publishedPoiSummarySchema.shape.city,
    revision: z.uuid().toLowerCase().nullable(),
    pois: z.array(catalogPoiSchema.extend({ inputRevision: z.uuid().toLowerCase() })),
  })
  .strict();

export const adminInventorySchema = catalogBaselineSchema.extend({
  pois: z.array(
    catalogBaselineSchema.shape.pois.element.extend({
      publicationId: z.uuid().nullable(),
      relatedPeople: z.array(
        z.object({ personId: z.string(), wikidataId: z.string(), profileVersion: z.uuid() }),
      ),
    }),
  ),
});

export const personBaselineSchema = z
  .object({
    personId: z.string().min(1),
    wikidataId: z.string().regex(/^Q[1-9]\d*$/),
    profileVersion: z.uuid().toLowerCase(),
  })
  .strict();

export const poiBaselineSchema = catalogPoiSchema
  .omit({ id: true, coordinates: true, osmIds: true })
  .extend({
    poiId: z.uuid().toLowerCase(),
    city: publishedPoiSummarySchema.shape.city,
    inputRevision: z.uuid().toLowerCase(),
    publicationId: z.uuid().toLowerCase().nullable(),
    relatedPeople: z.array(personBaselineSchema),
  });

export const storyWriteSchema = z
  .object({
    inputRevision: z.uuid().toLowerCase(),
    expectedPublicationId: z.uuid().toLowerCase().nullable(),
    detail: publishedPoiDetailSchema,
    generation: generationSchema,
    people: z.array(personWriteSchema),
  })
  .strict()
  .refine(
    ({ detail, people }) =>
      new Set(people.map(({ person }) => person.id)).size === people.length &&
      people.every(({ person }) =>
        detail.story.relatedPeople.some(({ personId }) => personId === person.id),
      ),
    { message: "Supplied profiles must uniquely belong to the Story's Related People." },
  );

export const catalogWriteSchema = z
  .object({
    city: publishedPoiSummarySchema.shape.city,
    revision: z.uuid().toLowerCase(),
    expectedRevision: z.uuid().toLowerCase().nullable(),
    pois: z.array(catalogPoiSchema),
  })
  .strict()
  .refine(({ pois }) => new Set(pois.map(({ id }) => id)).size === pois.length, {
    message: "Duplicate catalog POI ID.",
  });

export const poiCategoriesWriteSchema = z
  .object({
    poiId: z.uuid().toLowerCase(),
    inputRevision: z.uuid().toLowerCase(),
    revision: z.uuid().toLowerCase(),
    expectedRevision: z.uuid().toLowerCase().nullable(),
    expectedStateDigest: z.string().regex(/^[a-f0-9]{64}$/),
    categoryIds: publishedPoiSummarySchema.shape.categoryIds,
    definitions: z
      .array(publishedCategorySchema)
      .refine((categories) => new Set(categories.map(({ id }) => id)).size === categories.length, {
        message: "Duplicate category definition.",
      }),
  })
  .strict();

export const categoryCatalogCreateSchema = z
  .object({
    expectedStateDigest: z.string().regex(/^[a-f0-9]{64}$/),
    name: z
      .string()
      .refine(
        (name) =>
          name.trim().replace(/\s+/g, " ").length >= 1 &&
          name.trim().replace(/\s+/g, " ").length <= 80 &&
          !/[<>\r\n]/.test(name),
        { message: "Use a category name of 1–80 characters." },
      ),
  })
  .strict();

export const categoryCatalogRenameSchema = categoryCatalogCreateSchema.extend({
  id: publishedCategorySchema.shape.id,
});

export const categoryCatalogDeleteSchema = z
  .object({
    id: publishedCategorySchema.shape.id,
    expectedStateDigest: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export const categoryCatalogMoveSchema = z
  .object({
    id: publishedCategorySchema.shape.id,
    parentId: publishedCategorySchema.shape.id.nullable(),
    expectedStateDigest: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export const poiTypesAcquisitionSchema = z
  .object({
    wikidataId: z
      .string()
      .regex(/^Q[1-9]\d*$/)
      .nullable(),
    types: z
      .array(
        z.object({ id: z.string().regex(/^Q[1-9]\d*$/), label: z.string().trim().min(1) }).strict(),
      )
      .max(1000)
      .refine((types) => new Set(types.map(({ id }) => id)).size === types.length),
    skipped: z.boolean(),
    acquiredAt: z.iso.datetime(),
  })
  .strict()
  .refine(
    ({ wikidataId, skipped, types }) =>
      wikidataId === null ? skipped && types.length === 0 : !skipped,
    { message: "Only POIs without Wikidata identity may skip acquisition." },
  );

export const poiTypesWriteSchema = z
  .object({
    poiId: z.uuid().toLowerCase(),
    inputRevision: z.uuid().toLowerCase(),
    revision: z.uuid().toLowerCase(),
    expectedRevision: z.uuid().toLowerCase().nullable(),
    acquisition: poiTypesAcquisitionSchema,
  })
  .strict();

export const poiTypesBaselineSchema = z
  .object({
    poiId: z.uuid().toLowerCase(),
    city: publishedPoiSummarySchema.shape.city,
    name: z.string().min(1),
    wikidataId: z
      .string()
      .regex(/^Q[1-9]\d*$/)
      .nullable(),
    wikipediaPages: z.array(wikipediaPageSchema),
    inputRevision: z.uuid().toLowerCase(),
    revision: z.uuid().toLowerCase().nullable(),
    acquisition: poiTypesAcquisitionSchema.nullable(),
  })
  .strict()
  .refine(
    (state) =>
      !state.acquisition ||
      (state.revision !== null && state.acquisition.wikidataId === state.wikidataId),
    { message: "Accepted acquisition does not match the POI identity or revision." },
  );

export const typeCategoryRuleSchema = z
  .object({
    typeId: z.string().regex(/^Q[1-9]\d*$/),
    decision: z.enum(["mapped", "ignored", "unmapped"]),
    categoryIds: publishedPoiSummarySchema.shape.categoryIds,
    origin: z.enum(["manual", "automatic", "initial"]),
    reason: z.string().optional(),
    revision: z.uuid().toLowerCase(),
    updatedAt: z.iso.datetime(),
  })
  .strict()
  .refine(({ decision, categoryIds }) => (decision === "mapped") === Boolean(categoryIds.length));

export const typeCategoryRuleWriteSchema = z
  .object({
    typeId: typeCategoryRuleSchema.shape.typeId,
    categories: publishedPoiSummarySchema.shape.categoryIds.nullable(),
    revision: z.uuid().toLowerCase(),
    expectedStateDigest: z.string().regex(/^[a-f0-9]{64}$/),
    origin: z.literal("automatic").optional(),
    reason: z.string().trim().min(1).max(4000).optional(),
    definitions: z.array(publishedCategorySchema).max(20).optional(),
  })
  .strict()
  .refine((value) =>
    value.origin === "automatic"
      ? Boolean(value.reason)
      : value.reason === undefined && value.definitions === undefined,
  );

export const poiCategoriesBaselineSchema = z.object({
  poiId: z.uuid().toLowerCase(),
  inputRevision: z.uuid().toLowerCase(),
  revision: z.uuid().toLowerCase().nullable(),
  categoryIds: publishedPoiSummarySchema.shape.categoryIds,
  definitions: z.array(publishedCategorySchema),
});

export const categoryCatalogBaselineSchema = z
  .object({
    definitions: z.array(publishedCategorySchema),
    stateDigest: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export const typeCategoryRulesBaselineSchema = z
  .object({
    rules: z.array(typeCategoryRuleSchema),
    definitions: z.array(publishedCategorySchema),
    deletedNames: z.array(z.string()).optional(),
    stateDigest: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict()
  .refine(
    ({ rules, definitions }) =>
      new Set(rules.map(({ typeId }) => typeId)).size === rules.length &&
      new Set(definitions.map(({ id }) => id)).size === definitions.length &&
      rules.every(({ categoryIds }) =>
        categoryIds.every((id) => definitions.some((category) => category.id === id)),
      ),
  );

export type WikipediaPage = z.infer<typeof wikipediaPageSchema>;
