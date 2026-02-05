import { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ProfessionalStepProps {
    form: UseFormReturn<any>;
}

export function ProfessionalStep({ form }: ProfessionalStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Professional Details</h2>
                <p className="text-sm text-muted-foreground">
                    Provide your educational background and work experience.
                </p>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Academic Background
                </h3>

                {/* Class X */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="class_x_school"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Class X School</FormLabel>
                                <FormControl>
                                    <Input placeholder="School name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class_x_year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="2018" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class_x_percentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Percentage</FormLabel>
                                <FormControl>
                                    <Input placeholder="95" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Class XII */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="class_xii_school"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Class XII School</FormLabel>
                                <FormControl>
                                    <Input placeholder="School name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class_xii_year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="2020" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class_xii_percentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Percentage</FormLabel>
                                <FormControl>
                                    <Input placeholder="95" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Degree */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="degree_institution"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree Institution</FormLabel>
                                <FormControl>
                                    <Input placeholder="IIT Delhi" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="degree_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="B.Tech Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="degree_year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Graduation Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="2024" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="degree_cgpa"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CGPA</FormLabel>
                                <FormControl>
                                    <Input placeholder="8.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator />

            {/* Work Experience */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Work Experience
                </h3>

                <FormField
                    control={form.control}
                    name="current_company"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Company (if applicable)</FormLabel>
                            <FormControl>
                                <Input placeholder="Company name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="current_ctc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current CTC (LPA)</FormLabel>
                                <FormControl>
                                    <Input placeholder="12" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expected_ctc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expected CTC (LPA)</FormLabel>
                                <FormControl>
                                    <Input placeholder="18" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
