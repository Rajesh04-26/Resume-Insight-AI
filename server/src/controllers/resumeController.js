import { parseResumePdfToText } from "../services/resumeParserService.js";

export async function uploadResume(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Missing file" });
    const resumeText = await parseResumePdfToText(file.buffer);
    if (!resumeText) return res.status(422).json({ error: "Could not extract text from PDF" });
    res.json({ resumeText });
  } catch (err) {
    next(err);
  }
}

