import ConvertHandler from '../../modules/metric-imperial/convert-handler.js'

export default function convert(req, res) {
  if (req.method === 'POST') {
    const { input } = req.body,
      result = ConvertHandler.convert(input)

    // @ts-ignore
    return res.status(result.err ? 400 : 200).json(result)
  }
}
