import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trash2, Upload } from 'lucide-react';

interface HeroImage {
  name: string;
  url: string;
}

const BUCKET = 'hero-images';

const HeroImagesManagement = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
      limit: 100,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    const list = (data || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setImages(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;
      }
      toast({ title: 'Uploaded', description: 'Hero images uploaded successfully.' });
      e.target.value = '';
      await load();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm('Delete this image?')) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted' });
    await load();
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Hero Images</h2>
          <p className="text-sm text-muted-foreground">
            Images shown in the home page hero circle (auto-rotates every second).
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <span>
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload Images
            </span>
          </Button>
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No images yet. Upload some to show them on the hero section.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.name}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(img.name)}
                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroImagesManagement;
