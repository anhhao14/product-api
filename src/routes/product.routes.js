const router = require('express').Router();
const Product = require('../models/product.model');

// Xử lý lỗi chung
function handleError(res, err) {
  if (err.code === 11000) return res.status(409).json({ message: 'pid đã tồn tại' });
  if (err.name === 'ValidationError' || err.name === 'CastError')
    return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: err.message });
}

// CREATE
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body || {});
    res.status(201).json(product);
  } catch (err) { handleError(res, err); }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) { handleError(res, err); }
});

// READ ONE (theo pid)
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) { handleError(res, err); }
});

// UPDATE
router.put('/:pid', async (req, res) => {
  try {
    const { pid, ...data } = req.body || {}; // không cho đổi pid
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid }, data, { returnDocument: 'after', runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) { handleError(res, err); }
});

// DELETE
router.delete('/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'Đã xóa', product });
  } catch (err) { handleError(res, err); }
});

module.exports = router;