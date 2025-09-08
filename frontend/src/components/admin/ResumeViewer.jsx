import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { FileText, Download, X, ExternalLink } from 'lucide-react'

const ResumeViewer = ({ resumeUrl, resumeName, applicantName, open, setOpen }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = resumeName || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleOpenInNewTab = () => {
        window.open(resumeUrl, '_blank');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] w-full p-0 bg-white">
                <DialogHeader className="p-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    Resume Viewer
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    {applicantName} - {resumeName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleOpenInNewTab}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open in New Tab
                            </Button>
                            <Button
                                onClick={handleDownload}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                            <Button
                                onClick={() => setOpen(false)}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden">
                    {isLoading && (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading resume...</p>
                            </div>
                        </div>
                    )}
                    
                    <iframe
                        src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                        className={`w-full h-[70vh] border-0 ${isLoading ? 'hidden' : 'block'}`}
                        onLoad={() => setIsLoading(false)}
                        title={`Resume - ${applicantName}`}
                        style={{ minHeight: '500px' }}
                    />
                    
                    {/* Fallback for browsers that don't support PDF embedding */}
                    <div className="p-6 text-center bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">
                            Having trouble viewing the PDF? 
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                onClick={handleOpenInNewTab}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open in New Tab
                            </Button>
                            <Button
                                onClick={handleDownload}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResumeViewer
