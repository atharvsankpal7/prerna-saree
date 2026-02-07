'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UploadFolder = 'products' | 'categories' | 'reviews';

interface LocalImageUploaderProps {
  folder: UploadFolder;
  value: string[];
  onChange: (nextValue: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  buttonLabel?: string;
}

export default function LocalImageUploader({
  folder,
  value,
  onChange,
  multiple = false,
  maxFiles = multiple ? 8 : 1,
  disabled = false,
  buttonLabel = 'Upload Image',
}: LocalImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  const remainingSlots = Math.max(maxFiles - value.length, 0);
  const canUpload = !disabled && (multiple ? remainingSlots > 0 : true);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !canUpload) {
      return;
    }

    const selectedFiles = Array.from(fileList).slice(0, multiple ? remainingSlots : 1);
    if (selectedFiles.length === 0) {
      setError(`Maximum ${maxFiles} image${maxFiles > 1 ? 's' : ''} allowed.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i += 1) {
        const file = selectedFiles[i];
        setUploadStatus(`Uploading ${i + 1}/${selectedFiles.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      if (multiple) {
        onChange([...value, ...uploadedUrls]);
      } else {
        onChange([uploadedUrls[0]]);
      }
    } catch (uploadError: any) {
      setError(uploadError?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      setUploadStatus('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleUpload(event.target.files)}
      />

      <div className="flex flex-wrap gap-3">
        {value.map((imageUrl, index) => (
          <div key={`${imageUrl}-${index}`} className="relative group">
            <img
              src={imageUrl}
              alt={`Upload ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md border"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {canUpload && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-md border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground transition-colors flex items-center justify-center disabled:opacity-60"
            aria-label="Add image"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!canUpload || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
          {uploading ? 'Uploading...' : buttonLabel}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WEBP, GIF up to 8MB
        </p>
      </div>

      {uploadStatus && <p className="text-xs text-muted-foreground">{uploadStatus}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
