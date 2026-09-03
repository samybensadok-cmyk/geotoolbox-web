# ⚠️ TEMPORARY HOME — move these to `seo-audits`, then delete this directory

These are the working docs for the 2026-09-03 German localization. Their real home is
`~/Desktop/seo-audits/de-localization-2026-09-03/` and the glossary under
`~/Desktop/seo-audits/.claude/skills/article-localization/references/`.

They are committed **here** only because `~/Desktop` was unreadable for the whole session
(macOS TCC: Terminal.app was launched before Full Disk Access was granted, and TCC caches the
decision per process, so the toggle never reached the running Terminal). Rather than leave the
QA reports and the pending glossary edits on one laptop, they went into the pushed branch.

**On pickup, after restarting Terminal:**

```bash
rsync -a ~/geotoolbox-web/docs/de-localization-2026-09-03/ \
         ~/Desktop/seo-audits/de-localization-2026-09-03/
rsync -a ~/geotoolbox-web/.de-localization-artifacts/units \
         ~/geotoolbox-web/.de-localization-artifacts/out \
         ~/Desktop/seo-audits/de-localization-2026-09-03/     # bulk JSON, local-only
git -C ~/geotoolbox-web rm -r --cached docs/de-localization-2026-09-03
rm -rf ~/geotoolbox-web/docs/de-localization-2026-09-03
```

Then apply `GLOSSARY-APPEND-PENDING.md` to the DE glossary — that is step 0 in
`RESUME-DE-LOCALIZATION.md` and the reason this directory exists.

Not copied here (large and reproducible): `units/` and `out/` (712K + 308K). `units/` is a
mechanical split of `messages/{en,fr,es}.json`, all in git; `out/` is what `merge.mjs` combined
into the committed `messages/de.json`. Both live at `~/geotoolbox-web/.de-localization-artifacts/`
and in the session scratchpad.
