'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto object-cover',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    try {
      setIsUploading(true);

      // 파일명 안전하게 변환 (한글, 띄어쓰기 등 제거하고 영문과 숫자로 구성)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Supabase Storage 'images' 버킷에 파일 업로드
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 업로드된 이미지 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 에디터에 이미지 삽입
      if (urlData?.publicUrl) {
        editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
      }
      
    } catch (error: any) {
      console.error('Image upload error:', error.message);
      alert(`이미지 업로드에 실패했습니다.\n사유: ${error.message}\n\n(Supabase 관리자 페이지에서 'images'라는 이름의 Storage Bucket이 생성되어 있고 Public으로 설정되어 있는지 확인해주세요.)`);
    } finally {
      setIsUploading(false);
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('strike') ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <s>S</s>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          • List
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3 py-1 rounded text-sm font-medium flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          title="사진 올리기"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          <span>사진</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
}
