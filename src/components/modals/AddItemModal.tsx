import React, { useState } from 'react';
import { ItemCategory, ItemCondition } from '../../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (itemData: any) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.OTHER);
  const [condition, setCondition] = useState<ItemCondition>(ItemCondition.USED);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      title,
      description,
      price: parseInt(price, 10),
      category,
      condition,
      image: imagePreview || `https://picsum.photos/seed/${Date.now()}/400/300`
    });
    // Reset form for next time
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory(ItemCategory.OTHER);
    setCondition(ItemCondition.USED);
    setImagePreview(null);
    onClose();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const inputClass = "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const buttonClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <h2 className="text-2xl font-bold text-foreground">List a New Item</h2>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] pr-2 -mr-2">
          <div className="space-y-4">
            <input type="text" placeholder="Item Title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className={`${inputClass} h-24`} />
            <input type="number" placeholder="Price in Coins" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputClass} />
            
            <div className="grid grid-cols-2 gap-4">
                <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} className={inputClass}>
                    {Object.values(ItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={condition} onChange={(e) => setCondition(e.target.value as ItemCondition)} className={inputClass}>
                    {Object.values(ItemCondition).map(con => <option key={con} value={con}>{con}</option>)}
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Item Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" /> : <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  <div className="flex text-sm text-muted-foreground">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className={`${buttonClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`}>Cancel</button>
            <button type="submit" className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}>Add Item</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddItemModal;