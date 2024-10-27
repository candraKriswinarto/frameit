'use client'

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import ColorPicker from "./color-picker";
import { useCallback, useRef, useState } from "react";
import SettingSlider from "./settings-slider";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver';

export default function ImageUpload() {
  const [startColor, setStartColor] = useState('#2373a4');
  const [endColor, setEndColor] = useState('#be3c3c');
  const [zoom, setZoom] = useState(100);
  const [transparency, setTransparency] = useState(100);
  const [borderRadius, setBorderRadius] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [image, setImage] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        setImage(event.target.result.toString())
      }
    }
    reader.readAsDataURL(file);
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, accept: {
      'image/*': []
    }
  })

  const handleDownload = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, 'image-with-background.png')
          }
        })
      })
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* left sidebar */}
      <div className="w-64 p-4 bg-white overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Background</h2>
        <ColorPicker label="Start Color" color={startColor} onChange={setStartColor} />
        <ColorPicker label="End Color" color={endColor} onChange={setEndColor} />
        <h2 className="text-lg font-semibold mb-4 mt-8">Image Adjustments</h2>
        <div className="space-y-4">
          <SettingSlider
            label="Zoom"
            min={50}
            max={120}
            step={1}
            value={zoom}
            onChange={setZoom}
          />
          <SettingSlider
            label="Transparency"
            min={0}
            max={100}
            step={1}
            value={transparency}
            onChange={setTransparency}
            unit="%"
          />
          <SettingSlider
            label="Border Radius"
            min={0}
            max={50}
            step={1}
            value={borderRadius}
            onChange={setBorderRadius}
            unit="px"
          />
          <SettingSlider
            label="Shadow"
            min={0}
            max={59}
            step={1}
            value={shadow}
            onChange={setShadow}
            unit="px"
          />
        </div>

      </div>

      {/* image preview */}
      <div className="flex-1 p-8">
        <div
          ref={resultRef}
          style={{
            aspectRatio: '16 / 9',
            backgroundImage: `linear-gradient(to top right, ${startColor}, ${endColor})`
          }}
        >
          <div {...getRootProps()} className="w-full h-full flex items-center justify-center">
            <input {...getInputProps()} />
            {
              image ? (
                <img
                  src={image}
                  alt="uploaded image"
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    opacity: transparency / 100,
                    borderRadius: `${borderRadius}px`,
                    boxShadow: `0 0 ${shadow}px rgba(0, 0, 0, 0.5)`
                  }}
                />
              ) : <p className="text-gray-300">Drag 'n' drop some files here, or click to select files</p>
            }

          </div>
        </div>

        <div className="flex mt-4 justify-end">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
