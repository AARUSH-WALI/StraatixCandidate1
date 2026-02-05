import { UseFormReturn } from 'react-hook-form';
import { User, GraduationCap, Briefcase, FileText, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';

interface ReviewStepProps {
    form: UseFormReturn<any>;
    profile: any;
    userEmail: string;
    resumeFile: File | null;
    existingResumeUrl?: string;
    onEditStep: (step: number) => void;
    jobTitle: string;
}

export function ReviewStep({
    form,
    profile,
    userEmail,
    resumeFile,
    existingResumeUrl,
    onEditStep,
    jobTitle,
}: ReviewStepProps) {
    const values = form.getValues();

    const Section = ({
        icon: Icon,
        title,
        step,
        children,
    }: {
        icon: any;
        title: string;
        step: number;
        children: React.ReactNode;
    }) => (
        <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">{title}</h3>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditStep(step)}
                    className="text-muted-foreground hover:text-primary"
                >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                </Button>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );

    const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-muted-foreground w-36">{label}</span>
            <span className="text-sm text-foreground">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Review Your Application</h2>
                <p className="text-sm text-muted-foreground">
                    Please review your information before submitting your application for <strong>{jobTitle}</strong>.
                </p>
            </div>

            {/* Personal Information */}
            <Section icon={User} title="Personal Information" step={1}>
                <InfoRow label="Full Name" value={profile?.full_name} />
                <InfoRow label="Email" value={profile?.email || userEmail} />
                <InfoRow label="Phone" value={values.phone} />
                <InfoRow label="Date of Birth" value={values.date_of_birth} />
                <InfoRow label="Nationality" value={values.nationality} />
                <InfoRow label="Gender" value={values.gender} />
                <InfoRow label="Address" value={values.address} />
            </Section>

            {/* Professional Details */}
            <Section icon={GraduationCap} title="Academic & Professional Details" step={2}>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Education</p>
                        {values.degree_institution && (
                            <InfoRow
                                label="Degree"
                                value={`${values.degree_name || 'Unknown'} from ${values.degree_institution} (${values.degree_year || 'N/A'})`}
                            />
                        )}
                        {values.class_xii_school && (
                            <InfoRow label="Class XII" value={`${values.class_xii_school} (${values.class_xii_percentage}%)`} />
                        )}
                        {values.class_x_school && (
                            <InfoRow label="Class X" value={`${values.class_x_school} (${values.class_x_percentage}%)`} />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Experience</p>
                        <InfoRow label="Current Company" value={values.current_company} />
                        <InfoRow label="Current CTC" value={values.current_ctc ? `₹${values.current_ctc} LPA` : undefined} />
                        <InfoRow label="Expected CTC" value={values.expected_ctc ? `₹${values.expected_ctc} LPA` : undefined} />
                    </div>
                </div>
            </Section>

            {/* Documents */}
            <Section icon={FileText} title="Documents" step={3}>
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                        {resumeFile ? resumeFile.name : existingResumeUrl ? 'Resume on file' : 'No resume uploaded'}
                    </span>
                </div>
            </Section>

            {/* Save to Profile Option */}
            <div className="bg-muted/50 rounded-xl p-5">
                <FormField
                    control={form.control}
                    name="save_to_profile"
                    render={({ field }) => (
                        <FormItem className="flex items-start gap-3">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="mt-0.5"
                                />
                            </FormControl>
                            <div>
                                <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                                    Save details to my profile
                                </FormLabel>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    This will update your profile with the information provided for faster future applications.
                                </p>
                            </div>
                        </FormItem>
                    )}
                />
            </div>

            {/* Confirmation Notice */}
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                    By clicking "Submit Application", you confirm that all the information provided is accurate
                    and you agree to our terms of service and privacy policy.
                </p>
            </div>
        </div>
    );
}
