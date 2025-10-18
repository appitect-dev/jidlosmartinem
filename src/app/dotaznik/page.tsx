'use client';

import {Suspense} from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ChevronRight, CheckCircle} from 'lucide-react';

interface FormData {
    // Základní údaje
    jmeno: string;
    email: string;
    telefon: string;
    
    // Cíl klienta
    hlavniCil: string;
    
    // Investice
    investice: string;
    
    // Motivace
    duvodPoradenstvi: string;
    pripravenost: string;
}

const sections = [
    {title: 'Základní údaje', id: 'zakladni'},
    {title: 'Cíl klienta', id: 'cil'},
    {title: 'Investice', id: 'investice'},
    {title: 'Motivace', id: 'motivace'},
    {title: 'Shrnutí', id: 'shrnuti'}
];

// Create a separate component for the form logic that uses useSearchParams
function DotaznikForm() {
    const router = useRouter();

    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        jmeno: '',
        email: '',
        telefon: '',
        hlavniCil: '',
        investice: '',
        duvodPoradenstvi: '',
        pripravenost: ''
    });

    // Define required fields for each section
    const requiredFields = {
        zakladni: ['jmeno', 'email', 'telefon'],
        cil: ['hlavniCil'],
        investice: ['investice'],
        motivace: ['duvodPoradenstvi', 'pripravenost'],
        shrnuti: []
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const validateSection = (sectionId: string): boolean => {
        const newErrors: Record<string, string> = {};
        const fieldsToValidate = requiredFields[sectionId as keyof typeof requiredFields] || [];
        
        fieldsToValidate.forEach(field => {
            if (!formData[field as keyof FormData].trim()) {
                newErrors[field] = 'Toto pole je povinné';
            }
        });

        // Email validation
        if (sectionId === 'zakladni' && formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Zadejte platnou emailovou adresu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        const currentSectionId = sections[currentSection].id;
        
        // Validate current section before moving forward
        if (!validateSection(currentSectionId)) {
            return; // Stop if validation fails
        }

        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    // Helper function to render input with error handling
    const renderInputField = (
        field: keyof FormData,
        label: string,
        type: 'text' | 'email' | 'number' = 'text',
        required: boolean = false,
        placeholder?: string,
        min?: number,
        max?: number
    ) => {
        const hasError = !!errors[field];
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                        hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={placeholder}
                    required={required}
                    min={min}
                    max={max}
                />
                {hasError && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
        );
    };

    // Helper function to render select field with error handling
    const renderSelectField = (
        field: keyof FormData,
        label: string,
        options: { value: string; label: string }[],
        required: boolean = false
    ) => {
        const hasError = !!errors[field];
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                        hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required={required}
                >
                    <option value="">Vyberte možnost</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {hasError && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
        );
    };

    // Helper function to render textarea with error handling
    const renderTextareaField = (
        field: keyof FormData,
        label: string,
        rows: number = 3,
        required: boolean = false,
        placeholder?: string
    ) => {
        const hasError = !!errors[field];
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    rows={rows}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                        hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={placeholder}
                    required={required}
                />
                {hasError && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
        );
    };

    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        
        setIsSubmitting(true);
        try {
            console.log('Submitting dotaznik form...');
            
            // Validate all required fields before submission
            let hasErrors = false;
            const allErrors: Record<string, string> = {};

            // Validate all sections
            Object.keys(requiredFields).forEach(sectionId => {
                const fieldsToValidate = requiredFields[sectionId as keyof typeof requiredFields];
                fieldsToValidate.forEach(field => {
                    if (!formData[field as keyof FormData].trim()) {
                        allErrors[field] = 'Toto pole je povinné';
                        hasErrors = true;
                    }
                });
            });

            // Additional validation rules
            if (formData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    allErrors.email = 'Zadejte platnou emailovou adresu';
                    hasErrors = true;
                }
            }

            if (hasErrors) {
                setErrors(allErrors);
                alert('Zkontrolujte prosím všechna povinná pole a opravte chyby před odesláním.');
                // Go back to first section with errors
                const firstErrorSection = Object.keys(requiredFields).find(sectionId => 
                    requiredFields[sectionId as keyof typeof requiredFields].some(field => allErrors[field])
                );
                if (firstErrorSection) {
                    const sectionIndex = sections.findIndex(s => s.id === firstErrorSection);
                    if (sectionIndex !== -1) {
                        setCurrentSection(sectionIndex);
                    }
                }
                setIsSubmitting(false);
                return;
            }
            
            // Uložit data dotazníku
            const response = await fetch('/api/dotaznik', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...formData})
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Dotaznik submitted successfully:', result);
                
                // Redirect to rezervace page with sessionId parameter
                router.push(`/rezervace?sessionId=${result.sessionId}`);
            } else {
                // Handle API errors
                const errorData = await response.json();
                console.error('Error submitting dotaznik:', errorData);
                
                // You could show an error message to the user here
                alert(`Chyba při ukládání dotazníku: ${errorData.message || 'Neznámá chyba'}`);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Chyba při ukládání dotazníku:', error);
            alert('Nepodařilo se uložit dotazník. Zkuste to prosím znovu.');
            setIsSubmitting(false);
        }
    };

    const renderSection = () => {
        const section = sections[currentSection];

        switch (section.id) {
            case 'zakladni':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">👤 Základní údaje</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderInputField('jmeno', 'Jméno a příjmení', 'text', true)}
                            {renderInputField('email', 'E-mail', 'email', true)}
                            <div className="md:col-span-2">
                                {renderInputField('telefon', 'Telefon', 'text', true, '+420 123 456 789')}
                            </div>
                        </div>
                    </div>
                );

            case 'cil':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Cíl klienta</h3>
                        {renderTextareaField('hlavniCil', 'Jaký je váš hlavní cíl?', 4, true, 'Popište váš hlavní cíl v oblasti výživy a zdraví...')}
                    </div>
                );

            case 'investice':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 Investice do vaší změny</h3>
                        <p className="text-gray-600 mb-6">Abychom vás mohli správně zařadit do vhodného programu, potřebujeme vědět, jakou částkou jste ochotni investovat do vaší promeny.</p>
                        {renderSelectField('investice', 'Jakou maximální částku jste ochotni investovat?', [
                            { value: 'min_2000', label: 'Méně než 2 000 Kč' },
                            { value: 'vice_2000', label: 'Více než 2 000 Kč' }
                        ], true)}
                    </div>
                );

            case 'motivace':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">💪 Motivace a očekávání</h3>
                        {renderTextareaField('duvodPoradenstvi', 'Proč jste se rozhodli pro výživové poradenství právě teď?', 4, true, 'Co vás motivovalo k tomuto kroku...')}
                        {renderSelectField('pripravenost', 'Jak moc jste připraveni udělat změnu? (0–10)', [
                            ...Array.from({length: 11}, (_, i) => ({
                                value: i.toString(),
                                label: `${i} ${i <= 3 ? '(nízká)' : i <= 6 ? '(střední)' : '(vysoká)'}`
                            }))
                        ], true)}
                    </div>
                );

            case 'shrnuti':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Shrnutí dotazníku</h3>
                        <p className="text-gray-600 mb-6">
                            Zkontrolujte si prosím své odpovědi. Pokud chcete něco změnit, můžete se vrátit k předchozím
                            sekcím.
                        </p>

                        <div className="space-y-6">
                            {/* Základní údaje */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">👤 Základní údaje</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900">
                                    <div><strong>Jméno:</strong> {formData.jmeno}</div>
                                    <div><strong>E-mail:</strong> {formData.email}</div>
                                    <div><strong>Telefon:</strong> {formData.telefon}</div>
                                </div>
                            </div>

                            {/* Cíl */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">🎯 Váš cíl</h4>
                                <div className="text-sm space-y-2 text-gray-900">
                                    <div><strong>Hlavní cíl:</strong> {formData.hlavniCil}</div>
                                </div>
                            </div>

                            {/* Investice */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">💰 Investice</h4>
                                <div className="text-sm space-y-2 text-gray-900">
                                    <div><strong>Připravenost investovat:</strong> {formData.investice === 'min_2000' ? 'Méně než 2 000 Kč' : 'Více než 2 000 Kč'}</div>
                                </div>
                            </div>

                            {/* Motivace */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">💪 Motivace</h4>
                                <div className="text-sm space-y-2 text-gray-900">
                                    <div><strong>Důvod pro poradenství:</strong> {formData.duvodPoradenstvi}</div>
                                    <div><strong>Připravenost na změnu:</strong> {formData.pripravenost}/10</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3">ℹ️ Informace</h4>
                            <p className="text-sm text-gray-700">
                                Po odeslání dotazníku budete přesměrováni
                                na rezervaci bezplatné konzultace.
                                Všechny vaše údaje jsou v bezpečí a budou použity pouze pro přípravu vašeho programu.
                            </p>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Neznámá sekce</h3>
                        <p className="text-gray-600">Prosím vraťte se na předchozí sekci.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Dotazník klienta – Výživové poradenství
                    </h1>
                    <p className="text-xl text-gray-600">
                        30denní transformace
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Krok {currentSection + 1} z {sections.length}
            </span>
                        <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{width: `${((currentSection + 1) / sections.length) * 100}%`}}
                        ></div>
                    </div>
                </div>

                {/* Form content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    {renderSection()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentSection === 0 || isSubmitting}
                        className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 mr-2"/>
                        Zpět
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                            isSubmitting 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Odesílám...
                            </>
                        ) : (
                            <>
                                {currentSection === sections.length - 1 ? 'Dokončit' : 'Pokračovat'}
                                <ChevronRight className="h-5 w-5 ml-2"/>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Loading component for Suspense fallback
function DotaznikLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div
                    className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Načítání dotazníku...</p>
            </div>
        </div>
    );
}

// Main page component with Suspense wrapper
export default function DotaznikPage() {
    return (
        <Suspense fallback={<DotaznikLoading/>}>
            <DotaznikForm/>
        </Suspense>
    );
}
