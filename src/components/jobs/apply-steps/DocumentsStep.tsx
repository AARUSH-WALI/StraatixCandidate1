import { useState } from 'react';
import { Upload, CheckCircle, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentsStepProps {
    resumeFile: File | null;
    onResumeChange: (file: File | null) => void;
    existingResumeUrl?: string;
}

export function DocumentsStep({ resumeFile, onResumeChange, existingResumeUrl }: DocumentsStepProps) {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        validateAndSetFile(file);
    };

    const validateAndSetFile = (file: File | undefined) => {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF file.',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please upload a file smaller than 5MB.',
                variant: 'destructive',
            });
            return;
        }

        onResumeChange(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        validateAndSetFile(file);
    };

    const removeFile = () => {
        onResumeChange(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Documents</h2>
                <p className="text-sm text-muted-foreground">
                    Upload your resume and any additional documents.
                </p>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Resume *</h3>

                {resumeFile ? (
                    <div className="border border-success/30 bg-success/5 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <FileText className="h-6 w-6 text-success" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{resumeFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={removeFile}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-success text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ready to upload</span>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-1">
                            Drag and drop your resume here
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            or click to browse (PDF only, max 5MB)
                        </p>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload">
                            <Button type="button" variant="outline" asChild>
                                <span>Choose File</span>
                            </Button>
                        </label>
                    </div>
                )}

                {existingResumeUrl && !resumeFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>You have a resume on file. Upload a new one to replace it.</span>
                    </div>
                )}
            </div>

            {/* Additional info */}
            <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Tips for a great resume:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keep it concise (1-2 pages)</li>
                    <li>• Highlight relevant experience and skills</li>
                    <li>• Include measurable achievements</li>
                    <li>• Proofread for errors</li>
                </ul>
            </div>
        </div>
    );
}
