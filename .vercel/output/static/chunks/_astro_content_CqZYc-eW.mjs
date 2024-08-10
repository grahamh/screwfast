import pLimit from 'p-limit';
import { A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from './astro/assets-service_DJ0zasQP.mjs';
import { a as createComponent, i as renderUniqueStylesheet, j as renderScriptElement, k as createHeadAndContent, r as renderTemplate, d as renderComponent, u as unescapeHTML } from './astro/server_DkhlDSvU.mjs';
import 'kleur/colors';

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign({"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://screwfast.uk", "SSR": true}, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_DuUPqlXh.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_BceWr1rG.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_-MZip3VU.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1_Ba0ddAdG.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_BrkXtkgC.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_BKSOQhSb.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_Cu9DPEeO.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_CJ7j6CrM.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_8AttIEWb.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_D9YZqGlu.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_D9D_UKk1.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Bw41726h.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_Bdx8WyPi.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_DAeiv5sE.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_pzGYFChL.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_DRfDKrXi.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_94n9IW2E.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_C4kS8PAw.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_CgJP-BeN.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_B0XiFz8c.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started_CObHAKdn.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_BNh163sy.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_Cri0rbU0.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_C_slv-eg.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_DgkDu1Jb.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_BhL-6PcD.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_DZrDc9BY.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Cax7Aqap.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_z34d_Ada.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_BvVTjErx.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_C3xEzzWo.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_FsndwlBu.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_Vg-IkxMY.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_C2WoepO2.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_BXy2kvJE.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_Cgl00-Zq.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_ClMe33dJ.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist_D1bZTt8-.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_DXVXz82m.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_B9W2GHbU.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_B_uEzwpu.mjs'),"/src/content/insights/en/insight-1.md": () => import('./insight-1_D8lhppTp.mjs'),"/src/content/insights/en/insight-2.md": () => import('./insight-2_CV48vGnp.mjs'),"/src/content/insights/en/insight-3.md": () => import('./insight-3_sVediaxV.mjs'),"/src/content/insights/fr/insight-1.md": () => import('./insight-1_DuNnFE7c.mjs'),"/src/content/insights/fr/insight-2.md": () => import('./insight-2_1DBA3U71.mjs'),"/src/content/insights/fr/insight-3.md": () => import('./insight-3_BX0VCt35.mjs'),"/src/content/products/a765.md": () => import('./a765_6VGz19fh.mjs'),"/src/content/products/b203.md": () => import('./b203_C5mUvM9V.mjs'),"/src/content/products/f303.md": () => import('./f303_zk8O26pt.mjs'),"/src/content/products/t845.md": () => import('./t845_CBGLjSL_.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"docs":{"type":"content","entries":{"welcome-to-docs":"/src/content/docs/welcome-to-docs.mdx","advanced/technical-specifications":"/src/content/docs/advanced/technical-specifications.mdx","construction/custom-solutions":"/src/content/docs/construction/custom-solutions.mdx","construction/project-planning":"/src/content/docs/construction/project-planning.mdx","construction/safety":"/src/content/docs/construction/safety.mdx","construction/service-overview":"/src/content/docs/construction/service-overview.mdx","de/welcome-to-docs":"/src/content/docs/de/welcome-to-docs.mdx","es/welcome-to-docs":"/src/content/docs/es/welcome-to-docs.mdx","fa/welcome-to-docs":"/src/content/docs/fa/welcome-to-docs.mdx","fr/welcome-to-docs":"/src/content/docs/fr/welcome-to-docs.mdx","guides/first-project-checklist":"/src/content/docs/guides/first-project-checklist.mdx","guides/getting-started":"/src/content/docs/guides/getting-started.mdx","guides/intro":"/src/content/docs/guides/intro.mdx","ja/welcome-to-docs":"/src/content/docs/ja/welcome-to-docs.mdx","tools/equipment-care":"/src/content/docs/tools/equipment-care.mdx","tools/tool-guides":"/src/content/docs/tools/tool-guides.mdx","zh-cn/welcome-to-docs":"/src/content/docs/zh-cn/welcome-to-docs.mdx","de/guides/first-project-checklist":"/src/content/docs/de/guides/first-project-checklist.mdx","de/guides/getting-started":"/src/content/docs/de/guides/getting-started.mdx","de/guides/intro":"/src/content/docs/de/guides/intro.mdx","es/guides/first-project-checklist":"/src/content/docs/es/guides/first-project-checklist.mdx","es/guides/getting-started":"/src/content/docs/es/guides/getting-started.mdx","es/guides/intro":"/src/content/docs/es/guides/intro.mdx","fa/guides/first-project-checklist":"/src/content/docs/fa/guides/first-project-checklist.mdx","fa/guides/getting-started":"/src/content/docs/fa/guides/getting-started.mdx","fa/guides/intro":"/src/content/docs/fa/guides/intro.mdx","fr/guides/first-project-checklist":"/src/content/docs/fr/guides/first-project-checklist.mdx","fr/guides/getting-started":"/src/content/docs/fr/guides/getting-started.mdx","fr/guides/intro":"/src/content/docs/fr/guides/intro.mdx","ja/guides/first-project-checklist":"/src/content/docs/ja/guides/first-project-checklist.mdx","ja/guides/getting-started":"/src/content/docs/ja/guides/getting-started.mdx","ja/guides/intro":"/src/content/docs/ja/guides/intro.mdx","zh-cn/guides/first-project-checklist":"/src/content/docs/zh-cn/guides/first-project-checklist.mdx","zh-cn/guides/getting-started":"/src/content/docs/zh-cn/guides/getting-started.mdx","zh-cn/guides/intro":"/src/content/docs/zh-cn/guides/intro.mdx"}},"products":{"type":"content","entries":{"a765":"/src/content/products/a765.md","b203":"/src/content/products/b203.md","f303":"/src/content/products/f303.md","t845":"/src/content/products/t845.md"}},"blog":{"type":"content","entries":{"en/post-1":"/src/content/blog/en/post-1.md","en/post-2":"/src/content/blog/en/post-2.md","en/post-3":"/src/content/blog/en/post-3.md","fr/post-1":"/src/content/blog/fr/post-1.md","fr/post-2":"/src/content/blog/fr/post-2.md","fr/post-3":"/src/content/blog/fr/post-3.md"}},"insights":{"type":"content","entries":{"en/insight-1":"/src/content/insights/en/insight-1.md","en/insight-2":"/src/content/insights/en/insight-2.md","en/insight-3":"/src/content/insights/en/insight-3.md","fr/insight-1":"/src/content/insights/fr/insight-1.md","fr/insight-2":"/src/content/insights/fr/insight-2.md","fr/insight-3":"/src/content/insights/fr/insight-3.md"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_BxUZ5sNQ.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_DKdQcAXz.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_DD1Z7Rx_.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1_BIqPNnoV.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_BeuKKWmK.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_C9N5hIAs.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_DKpO2L6i.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_SvZeZ6eF.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_Ciauu6WM.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_K7bs0rR_.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_DsYVODcy.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Dsc1lBHI.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_k3yeqzD0.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_B5s2s90H.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_DnO4nJTq.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_DFivTTmR.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_CidDGtVS.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_IBOWsxEA.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_QfXiy7sl.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_BUdOtywA.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started_D_dNBm0O.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_Chdn6br8.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_DV_33GbX.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_BNvEcNjT.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_Ds0t857x.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_CRNQKkC4.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_DCHtMGuH.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_DlMEG9jk.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_D7A_nQnw.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_DfuoYP5g.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Wtn8AFWM.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_CzodIgGy.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_BU3OHTk-.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_Cf-n4x5i.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_Cu4GD27a.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_D86J7Jlf.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_CcWTU5r3.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist_moJ6DTd6.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_D1WV8Owv.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_VcBSe5ff.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_Dz4qN2rK.mjs'),"/src/content/insights/en/insight-1.md": () => import('./insight-1_DBgjS3YJ.mjs'),"/src/content/insights/en/insight-2.md": () => import('./insight-2_tWpka1If.mjs'),"/src/content/insights/en/insight-3.md": () => import('./insight-3_2nqvz9DB.mjs'),"/src/content/insights/fr/insight-1.md": () => import('./insight-1_Bea1cDf5.mjs'),"/src/content/insights/fr/insight-2.md": () => import('./insight-2_B-aRTEXK.mjs'),"/src/content/insights/fr/insight-3.md": () => import('./insight-3_CpknargD.mjs'),"/src/content/products/a765.md": () => import('./a765_D9UQCW7x.mjs'),"/src/content/products/b203.md": () => import('./b203_HcVro5d0.mjs'),"/src/content/products/f303.md": () => import('./f303_DG2ew2I2.mjs'),"/src/content/products/t845.md": () => import('./t845_2bpk_4uo.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
