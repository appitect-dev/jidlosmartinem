'use client';

import {Suspense} from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ChevronRight, CheckCircle} from 'lucide-react';

interface FormData {
    // Základní údaje
    jmeno: string;
    vek: string;
    vyska: string;
    hmotnost: string;
    pohlavi: string;
    email: string;
    telefon: string;

    // Cíl klienta
    hlavniCil: string;
    vedlejsiCile: string;
    terminalCile: string;

    // Zdravotní stav
    zdravotniDiagnozy: string;
    lekyDoplnky: string;
    alergie: string;
    zdravotniStav: string;
    krevniTesty: string;
    bolesti: string;

    // Tělesná kompozice
    telesnaKonstituce: string;
    pohybovyRezim: string;
    tydennieakitivty: string;
    sedaveZamestnani: string;
    pohybovaOmezeni: string;

    // Spánek
    hodinySpanek: string;
    odpocaty: string;
    spankoveNavyky: string;
    problemySpanek: string;

    // Stravovací návyky
    pocetJidel: string;
    typJidel: string;
    castostMaso: string;
    pravidelnost: string;
    voda: string;
    zachvaty: string;
    spokojenostJidlo: string;

    // Stravovací minulost
    minuleDiety: string;
    fungovaloNefungovalo: string;
    vztahKJidlu: string;

    // Psychika a životní styl
    aktualniStres: string;
    hlavniStresor: string;
    ritualyRelaxace: string;
    koureniAlkohol: string;
    volnyCas: string;
    podporaOkoli: string;

    // Záznam jídelníčku
    zaznamJidelnicku: string;

    // Motivace
    duvodPoradenstvi: string;
    ocekavani: string;
    pripravenost: string;
    prekazy: string;
}

const sections = [
    {title: 'Základní údaje', id: 'zakladni'},
    {title: 'Cíl klienta', id: 'cil'},
    {title: 'Zdravotní stav', id: 'zdravi'},
    {title: 'Tělesná kompozice', id: 'telo'},
    {title: 'Spánek', id: 'spanek'},
    {title: 'Stravovací návyky', id: 'stravovani'},
    {title: 'Stravovací minulost', id: 'minulost'},
    {title: 'Psychika a lifestyle', id: 'psychika'},
    {title: 'Záznam jídelníčku', id: 'zaznam'},
    {title: 'Motivace', id: 'motivace'},
    {title: 'Shrnutí', id: 'shrnuti'}
];

// Create a separate component for the form logic that uses useSearchParams
function DotaznikForm() {
    const router = useRouter();

    const [currentSection, setCurrentSection] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormData>({
        jmeno: '', vek: '', vyska: '', hmotnost: '', pohlavi: '', email: '', telefon: '',
        hlavniCil: '', vedlejsiCile: '', terminalCile: '',
        zdravotniDiagnozy: '', lekyDoplnky: '', alergie: '', zdravotniStav: '', krevniTesty: '', bolesti: '',
        telesnaKonstituce: '', pohybovyRezim: '', tydennieakitivty: '', sedaveZamestnani: '', pohybovaOmezeni: '',
        hodinySpanek: '', odpocaty: '', spankoveNavyky: '', problemySpanek: '',
        pocetJidel: '', typJidel: '', castostMaso: '', pravidelnost: '', voda: '', zachvaty: '', spokojenostJidlo: '',
        minuleDiety: '', fungovaloNefungovalo: '', vztahKJidlu: '',
        aktualniStres: '', hlavniStresor: '', ritualyRelaxace: '', koureniAlkohol: '', volnyCas: '', podporaOkoli: '',
        zaznamJidelnicku: '',
        duvodPoradenstvi: '', ocekavani: '', pripravenost: '', prekazy: ''
    });

    // Define required fields for each section
    const requiredFields = {
        zakladni: ['jmeno', 'email', 'vek', 'vyska', 'hmotnost', 'pohlavi'],
        cil: ['hlavniCil'],
        motivace: ['duvodPoradenstvi', 'ocekavani', 'pripravenost']
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

        // Age validation
        if (sectionId === 'zakladni' && formData.vek) {
            const age = parseInt(formData.vek);
            if (isNaN(age) || age < 16 || age > 100) {
                newErrors.vek = 'Věk musí být mezi 16 a 100 lety';
            }
        }

        // Height validation
        if (sectionId === 'zakladni' && formData.vyska) {
            const height = parseInt(formData.vyska);
            if (isNaN(height) || height < 50 || height > 250) {
                newErrors.vyska = 'Výška musí být mezi 50 a 250 cm';
            }
        }

        // Weight validation
        if (sectionId === 'zakladni' && formData.hmotnost) {
            const weight = parseInt(formData.hmotnost);
            if (isNaN(weight) || weight < 20 || weight > 300) {
                newErrors.hmotnost = 'Hmotnost musí být mezi 20 a 300 kg';
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

            if (formData.vek) {
                const age = parseInt(formData.vek);
                if (isNaN(age) || age < 16 || age > 100) {
                    allErrors.vek = 'Věk musí být mezi 16 a 100 lety';
                    hasErrors = true;
                }
            }

            if (formData.vyska) {
                const height = parseInt(formData.vyska);
                if (isNaN(height) || height < 50 || height > 250) {
                    allErrors.vyska = 'Výška musí být mezi 50 a 250 cm';
                    hasErrors = true;
                }
            }

            if (formData.hmotnost) {
                const weight = parseInt(formData.hmotnost);
                if (isNaN(weight) || weight < 20 || weight > 300) {
                    allErrors.hmotnost = 'Hmotnost musí být mezi 20 a 300 kg';
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
            }
        } catch (error) {
            console.error('Chyba při ukládání dotazníku:', error);
            alert('Nepodařilo se uložit dotazník. Zkuste to prosím znovu.');
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
                            {renderInputField('vek', 'Věk', 'number', true, undefined, 16, 100)}
                            {renderInputField('vyska', 'Výška (cm)', 'number', true, undefined, 50, 250)}
                            {renderInputField('hmotnost', 'Hmotnost (kg)', 'number', true, undefined, 20, 300)}
                            {renderSelectField('pohlavi', 'Pohlaví', [
                                { value: 'muž', label: 'Muž' },
                                { value: 'žena', label: 'Žena' },
                                { value: 'jiné', label: 'Jiné' }
                            ], true)}
                            {renderInputField('email', 'E-mail', 'email', true)}
                            <div className="md:col-span-2">
                                {renderInputField('telefon', 'Telefon', 'text', false, '+420 123 456 789')}
                            </div>
                        </div>
                    </div>
                );

            case 'cil':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Cíl klienta</h3>
                        {renderTextareaField('hlavniCil', 'Jaký je váš hlavní cíl?', 3, true, 'Popište váš hlavní cíl...')}
                        {renderTextareaField('vedlejsiCile', 'Máte vedlejší cíle?', 3, false, 'Další cíle, které chcete dosáhnout...')}
                        {renderInputField('terminalCile', 'Do kdy byste chtěli výsledků dosáhnout?', 'text', false, 'např. do 3 měsíců, do léta...')}
                    </div>
                );

            case 'zdravi':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Zdravotní stav a omezení</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte nějaké zdravotní
                                diagnózy?</label>
                            <textarea
                                value={formData.zdravotniDiagnozy}
                                onChange={(e) => handleInputChange('zdravotniDiagnozy', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte případné diagnózy nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Užíváte pravidelně léky nebo
                                doplňky stravy? Jaké?</label>
                            <textarea
                                value={formData.lekyDoplnky}
                                onChange={(e) => handleInputChange('lekyDoplnky', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Vyjmenujte léky a doplňky nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte nějaké potravinové
                                alergie nebo intolerance?</label>
                            <textarea
                                value={formData.alergie}
                                onChange={(e) => handleInputChange('alergie', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte alergie a intolerance nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaký je váš zdravotní stav
                                podle lékaře?</label>
                            <select
                                value={formData.zdravotniStav}
                                onChange={(e) => handleInputChange('zdravotniStav', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte stav</option>
                                <option value="výborný">Výborný</option>
                                <option value="dobrý">Dobrý</option>
                                <option value="průměrný">Průměrný</option>
                                <option value="slabší">Slabší</option>
                                <option value="špatný">Špatný</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Absolvovali jste v posledním
                                roce krevní testy?</label>
                            <select
                                value={formData.krevniTesty}
                                onChange={(e) => handleInputChange('krevniTesty', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano-vse-ok">Ano, vše v pořádku</option>
                                <option value="ano-problemy">Ano, byly zjištěny problémy</option>
                                <option value="ne">Ne</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trpíte častými
                                bolestmi?</label>
                            <textarea
                                value={formData.bolesti}
                                onChange={(e) => handleInputChange('bolesti', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte kde a jak často nebo napište 'Ne'"
                            />
                        </div>
                    </div>
                );

            case 'telo':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🏋️‍♂️ Tělesná kompozice a pohyb</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak byste popsali svou
                                tělesnou konstituci?</label>
                            <select
                                value={formData.telesnaKonstituce}
                                onChange={(e) => handleInputChange('telesnaKonstituce', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte typ</option>
                                <option value="štíhlá">Štíhlá</option>
                                <option value="atletická">Atletická</option>
                                <option value="průměrná">Průměrná</option>
                                <option value="nadváha">Nadváha</option>
                                <option value="obézní">Obézní</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak často a jak intenzivně
                                se hýbete?</label>
                            <textarea
                                value={formData.pohybovyRezim}
                                onChange={(e) => handleInputChange('pohybovyRezim', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište svou pohybovou aktivitu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak vypadá váš týdenní
                                pohybový režim?</label>
                            <textarea
                                value={formData.tydennieakitivty}
                                onChange={(e) => handleInputChange('tydennieakitivty', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Rozepište aktivity po dnech"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte sedavé
                                zaměstnání?</label>
                            <select
                                value={formData.sedaveZamestnani}
                                onChange={(e) => handleInputChange('sedaveZamestnani', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano">Ano</option>
                                <option value="částečně">Částečně</option>
                                <option value="ne">Ne</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte pohybová omezení, úrazy
                                nebo bolesti při sportu?</label>
                            <textarea
                                value={formData.pohybovaOmezeni}
                                onChange={(e) => handleInputChange('pohybovaOmezeni', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište omezení nebo napište 'Ne'"
                            />
                        </div>
                    </div>
                );

            case 'spanek':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">😴 Spánek a regenerace</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolik hodin denně
                                spíte?</label>
                            <select
                                value={formData.hodinySpanek}
                                onChange={(e) => handleInputChange('hodinySpanek', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte počet hodin</option>
                                <option value="méně než 5">Méně než 5 hodin</option>
                                <option value="5-6">5-6 hodin</option>
                                <option value="6-7">6-7 hodin</option>
                                <option value="7-8">7-8 hodin</option>
                                <option value="8-9">8-9 hodin</option>
                                <option value="více než 9">Více než 9 hodin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cítíte se po probuzení
                                odpočatí?</label>
                            <select
                                value={formData.odpocaty}
                                onChange={(e) => handleInputChange('odpocaty', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="vždy">Vždy</option>
                                <option value="většinou">Většinou</option>
                                <option value="někdy">Někdy</option>
                                <option value="zřídka">Zřídka</option>
                                <option value="nikdy">Nikdy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaké máte spánkové
                                návyky?</label>
                            <textarea
                                value={formData.spankoveNavyky}
                                onChange={(e) => handleInputChange('spankoveNavyky', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Čas usínání, probuzení, rituály před spaním..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte problémy s usínáním,
                                probouzením nebo nekvalitním spánkem?</label>
                            <textarea
                                value={formData.problemySpanek}
                                onChange={(e) => handleInputChange('problemySpanek', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište problémy nebo napište 'Ne'"
                            />
                        </div>
                    </div>
                );

            case 'stravovani':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Stravovací návyky</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolikrát denně jíte?</label>
                            <select
                                value={formData.pocetJidel}
                                onChange={(e) => handleInputChange('pocetJidel', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte počet</option>
                                <option value="1-2x">1-2x denně</option>
                                <option value="3x">3x denně</option>
                                <option value="4-5x">4-5x denně</option>
                                <option value="6+">6+ denně</option>
                                <option value="nepravidelně">Nepravidelně</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaký typ jídel
                                převládá?</label>
                            <textarea
                                value={formData.typJidel}
                                onChange={(e) => handleInputChange('typJidel', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Domácí vaření, polotovary, restaurace, fast food..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak často jíte maso, mléčné
                                výrobky, sladkosti?</label>
                            <textarea
                                value={formData.castostMaso}
                                onChange={(e) => handleInputChange('castostMaso', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte frekvenci jednotlivých potravin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jíte pravidelně? Vynecháváte
                                jídla? Která?</label>
                            <textarea
                                value={formData.pravidelnost}
                                onChange={(e) => handleInputChange('pravidelnost', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište pravidelnost stravy a vynechávání jídel"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolik vody denně vypijete? A
                                další nápoje?</label>
                            <textarea
                                value={formData.voda}
                                onChange={(e) => handleInputChange('voda', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Množství vody a jiných nápojů (káva, čaj, alkohol...)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte večerní/emoční/jedací
                                záchvaty?</label>
                            <textarea
                                value={formData.zachvaty}
                                onChange={(e) => handleInputChange('zachvaty', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište situace nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kdy naposledy jste se cítili
                                s jídlem opravdu spokojeni a proč?</label>
                            <textarea
                                value={formData.spokojenostJidlo}
                                onChange={(e) => handleInputChange('spokojenostJidlo', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište období spokojenosti se stravou"
                            />
                        </div>
                    </div>
                );

            case 'minulost':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Stravovací minulost</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zkoušeli jste v minulosti
                                nějaké diety? Jaké a s jakým výsledkem?</label>
                            <textarea
                                value={formData.minuleDiety}
                                onChange={(e) => handleInputChange('minuleDiety', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Vyjmenujte diety a jejich výsledky"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co vám v minulosti při změně
                                stravování fungovalo / nefungovalo?</label>
                            <textarea
                                value={formData.fungovaloNefungovalo}
                                onChange={(e) => handleInputChange('fungovaloNefungovalo', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište zkušenosti s různými přístupy"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaký je váš vztah k
                                jídlu?</label>
                            <textarea
                                value={formData.vztahKJidlu}
                                onChange={(e) => handleInputChange('vztahKJidlu', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Pozitivní, komplikovaný, kontrolující, uvolněný..."
                            />
                        </div>
                    </div>
                );

            case 'psychika':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🧠 Psychika a životní styl</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak hodnotíte svůj aktuální
                                stres? (1-10)</label>
                            <select
                                value={formData.aktualniStres}
                                onChange={(e) => handleInputChange('aktualniStres', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte úroveň</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num}
                                            value={num.toString()}>{num} {num <= 3 ? '(nízký)' : num <= 6 ? '(střední)' : '(vysoký)'}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co je váš hlavní
                                stresor?</label>
                            <textarea
                                value={formData.hlavniStresor}
                                onChange={(e) => handleInputChange('hlavniStresor', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Práce, rodina, finance, zdraví..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte nějaké rituály pro
                                zvládání stresu nebo relaxaci?</label>
                            <textarea
                                value={formData.ritualyRelaxace}
                                onChange={(e) => handleInputChange('ritualyRelaxace', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Meditace, sport, čtení, hudba..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kouříte? Pijete alkohol? Jak
                                často?</label>
                            <textarea
                                value={formData.koureniAlkohol}
                                onChange={(e) => handleInputChange('koureniAlkohol', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte frekvenci nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak trávíte volný
                                čas?</label>
                            <textarea
                                value={formData.volnyCas}
                                onChange={(e) => handleInputChange('volnyCas', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište své koníčky a aktivity"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Podporuje vás vaše okolí v
                                péči o zdraví?</label>
                            <select
                                value={formData.podporaOkoli}
                                onChange={(e) => handleInputChange('podporaOkoli', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano-velmi">Ano, velmi podporuje</option>
                                <option value="ano-obcas">Ano, občas</option>
                                <option value="neutrální">Neutrální postoj</option>
                                <option value="spíše-ne">Spíše ne</option>
                                <option value="vůbec-ne">Vůbec ne</option>
                            </select>
                        </div>
                    </div>
                );

            case 'zaznam':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Záznam jídelníčku (volitelné)</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Můžete mi poskytnout záznam 2–3 dnů vašeho typického jídelníčku?
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                Uveďte čas, co jste jedli/pili, množství, případně pocity...
                            </p>
                            <textarea
                                value={formData.zaznamJidelnicku}
                                onChange={(e) => handleInputChange('zaznamJidelnicku', e.target.value)}
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Den 1:
7:00 - Snídaně: káva, rohlík s máslem
10:00 - Svačina: jablko
12:30 - Oběd: ...

Den 2:
..."
                            />
                        </div>
                    </div>
                );

            case 'motivace':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">💪 Motivace a očekávání</h3>
                        {renderTextareaField('duvodPoradenstvi', 'Proč jste se rozhodli pro výživové poradenství právě teď?', 4, true, 'Co vás motivovalo k tomuto kroku...')}
                        {renderTextareaField('ocekavani', 'Co očekáváte ode mě jako poradce?', 4, true, 'Vaše očekávání a požadavky...')}
                        {renderSelectField('pripravenost', 'Jak moc jste připraveni udělat změnu? (0–10)', [
                            ...Array.from({length: 11}, (_, i) => ({
                                value: i.toString(),
                                label: `${i} ${i <= 3 ? '(nízká)' : i <= 6 ? '(střední)' : '(vysoká)'}`
                            }))
                        ], true)}
                        {renderTextareaField('prekazy', 'Co by vás mohlo během procesu brzdit?', 4, false, 'Časové omezení, rodinné situace, cestování...')}
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
                                    <div><strong>Věk:</strong> {formData.vek} let</div>
                                    <div><strong>Výška:</strong> {formData.vyska} cm</div>
                                    <div><strong>Hmotnost:</strong> {formData.hmotnost} kg</div>
                                    <div><strong>Pohlaví:</strong> {formData.pohlavi}</div>
                                    <div><strong>E-mail:</strong> {formData.email}</div>
                                </div>
                            </div>

                            {/* Cíl */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">🎯 Váš cíl</h4>
                                <div className="text-sm space-y-2 text-gray-900">
                                    <div><strong>Hlavní cíl:</strong> {formData.hlavniCil}</div>
                                    {formData.vedlejsiCile &&
                                        <div><strong>Vedlejší cíle:</strong> {formData.vedlejsiCile}</div>}
                                    {formData.terminalCile &&
                                        <div><strong>Termín:</strong> {formData.terminalCile}</div>}
                                </div>
                            </div>

                            {/* Motivace */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">💪 Motivace</h4>
                                <div className="text-sm space-y-2 text-gray-900">
                                    <div><strong>Důvod pro poradenství:</strong> {formData.duvodPoradenstvi}</div>
                                    <div><strong>Očekávání:</strong> {formData.ocekavani}</div>
                                    <div><strong>Připravenost na změnu:</strong> {formData.pripravenost}/10</div>
                                </div>
                            </div>

                            {/* Další důležité údaje */}
                            {(formData.alergie || formData.zdravotniDiagnozy) && (
                                <div className="bg-red-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">⚠️ Důležité zdravotní
                                        informace</h4>
                                    <div className="text-sm space-y-2 text-gray-900">
                                        {formData.alergie &&
                                            <div><strong>Alergie/intolerance:</strong> {formData.alergie}</div>}
                                        {formData.zdravotniDiagnozy &&
                                            <div><strong>Zdravotní diagnózy:</strong> {formData.zdravotniDiagnozy}
                                            </div>}
                                    </div>
                                </div>
                            )}
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

            case 'telo':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🏋️‍♂️ Tělesná kompozice a pohyb</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak byste popsali svou
                                tělesnou konstituci?</label>
                            <select
                                value={formData.telesnaKonstituce}
                                onChange={(e) => handleInputChange('telesnaKonstituce', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte typ</option>
                                <option value="ektomorf">Ektomorf (štíhlý, těžko nabírám váhu)</option>
                                <option value="mezomorf">Mezomorf (atletická postava)</option>
                                <option value="endomorf">Endomorf (kulatější, snadno nabírám váhu)</option>
                                <option value="nevim">Nevím</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak často a jak intenzivně
                                se hýbete?</label>
                            <textarea
                                value={formData.pohybovyRezim}
                                onChange={(e) => handleInputChange('pohybovyRezim', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. 3x týdně posilovna, denní procházky..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak vypadá váš týdenní
                                pohybový režim?</label>
                            <textarea
                                value={formData.tydennieakitivty}
                                onChange={(e) => handleInputChange('tydennieakitivty', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište konkrétní aktivity během týdne"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte sedavé
                                zaměstnání?</label>
                            <select
                                value={formData.sedaveZamestnani}
                                onChange={(e) => handleInputChange('sedaveZamestnani', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano-prevazne">Ano, převážně sedím</option>
                                <option value="castecne">Částečně, kombinace</option>
                                <option value="ne">Ne, aktivní práce</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte pohybová omezení, úrazy
                                nebo bolesti při sportu?</label>
                            <textarea
                                value={formData.pohybovaOmezeni}
                                onChange={(e) => handleInputChange('pohybovaOmezeni', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte omezení nebo napište 'Ne'"
                            />
                        </div>
                    </div>
                );

            case 'spanek':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">😴 Spánek a regenerace</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolik hodin denně
                                spíte?</label>
                            <select
                                value={formData.hodinySpanek}
                                onChange={(e) => handleInputChange('hodinySpanek', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte počet hodin</option>
                                <option value="méně než 5">Méně než 5 hodin</option>
                                <option value="5-6">5-6 hodin</option>
                                <option value="7-8">7-8 hodin</option>
                                <option value="9-10">9-10 hodin</option>
                                <option value="více než 10">Více než 10 hodin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cítíte se po probuzení
                                odpočatí?</label>
                            <select
                                value={formData.odpocaty}
                                onChange={(e) => handleInputChange('odpocaty', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano-vzdy">Ano, vždy</option>
                                <option value="casto">Častokrát</option>
                                <option value="obcas">Občas</option>
                                <option value="zridka">Zřídka</option>
                                <option value="nikdy">Nikdy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaké máte spánkové
                                návyky?</label>
                            <textarea
                                value={formData.spankoveNavyky}
                                onChange={(e) => handleInputChange('spankoveNavyky', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. kdy chodíte spát, rutina před spaním, prostředí..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte problémy s usínáním,
                                probouzením nebo nekvalitním spánkem?</label>
                            <textarea
                                value={formData.problemySpanek}
                                onChange={(e) => handleInputChange('problemySpanek', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište případné problémy nebo napište 'Ne'"
                            />
                        </div>
                    </div>
                );

            case 'stravovani':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Stravovací návyky</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolikrát denně jíte?</label>
                            <select
                                value={formData.pocetJidel}
                                onChange={(e) => handleInputChange('pocetJidel', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte počet</option>
                                <option value="1-2x">1-2x denně</option>
                                <option value="3x">3x denně</option>
                                <option value="4-5x">4-5x denně</option>
                                <option value="6x a více">6x a více</option>
                                <option value="nepravidelně">Nepravidelně</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaký typ jídel
                                převládá?</label>
                            <textarea
                                value={formData.typJidel}
                                onChange={(e) => handleInputChange('typJidel', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. domácí vaření, polotovary, fastfood, zdravá strava..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak často jíte maso, mléčné
                                výrobky, sladkosti?</label>
                            <textarea
                                value={formData.castostMaso}
                                onChange={(e) => handleInputChange('castostMaso', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. maso 2x týdně, mléčné denně, sladkosti občas..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jíte pravidelně? Vynecháváte
                                jídla? Která?</label>
                            <textarea
                                value={formData.pravidelnost}
                                onChange={(e) => handleInputChange('pravidelnost', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište svůj jídelní rytmus"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kolik vody denně vypijete? A
                                další nápoje?</label>
                            <textarea
                                value={formData.voda}
                                onChange={(e) => handleInputChange('voda', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. 1,5l vody, 2 kávy, čaj..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte večerní/emoční/jedací
                                záchvaty?</label>
                            <textarea
                                value={formData.zachvaty}
                                onChange={(e) => handleInputChange('zachvaty', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište případné problémy nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kdy naposledy jste se cítili
                                s jídlem opravdu spokojeni a proč?</label>
                            <textarea
                                value={formData.spokojenostJidlo}
                                onChange={(e) => handleInputChange('spokojenostJidlo', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište situaci, kdy jste měli pozitivní vztah k jídlu"
                            />
                        </div>
                    </div>
                );

            case 'minulost':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Stravovací minulost</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zkoušeli jste v minulosti
                                nějaké diety? Jaké a s jakým výsledkem?</label>
                            <textarea
                                value={formData.minuleDiety}
                                onChange={(e) => handleInputChange('minuleDiety', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Vyjmenujte diety a popište výsledky"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co vám v minulosti při změně
                                stravování fungovalo / nefungovalo?</label>
                            <textarea
                                value={formData.fungovaloNefungovalo}
                                onChange={(e) => handleInputChange('fungovaloNefungovalo', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište co bylo úspěšné a co ne"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jaký je váš vztah k
                                jídlu?</label>
                            <textarea
                                value={formData.vztahKJidlu}
                                onChange={(e) => handleInputChange('vztahKJidlu', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. pozitivní, komplikovaný, emoční, praktický..."
                            />
                        </div>
                    </div>
                );

            case 'psychika':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🧠 Psychika a životní styl</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak hodnotíte svůj aktuální
                                stres? (1-10)</label>
                            <select
                                value={formData.aktualniStres}
                                onChange={(e) => handleInputChange('aktualniStres', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte úroveň</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num}
                                            value={num.toString()}>{num} {num <= 3 ? '(nízký)' : num <= 7 ? '(střední)' : '(vysoký)'}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co je váš hlavní
                                stresor?</label>
                            <textarea
                                value={formData.hlavniStresor}
                                onChange={(e) => handleInputChange('hlavniStresor', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. práce, rodina, finance, zdraví..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Máte nějaké rituály pro
                                zvládání stresu nebo relaxaci?</label>
                            <textarea
                                value={formData.ritualyRelaxace}
                                onChange={(e) => handleInputChange('ritualyRelaxace', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. meditace, sport, četba, hudba..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kouříte? Pijete alkohol? Jak
                                často?</label>
                            <textarea
                                value={formData.koureniAlkohol}
                                onChange={(e) => handleInputChange('koureniAlkohol', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Uveďte frekvenci nebo napište 'Ne'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak trávíte volný
                                čas?</label>
                            <textarea
                                value={formData.volnyCas}
                                onChange={(e) => handleInputChange('volnyCas', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Popište své volnočasové aktivity"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Podporuje vás vaše okolí v
                                péči o zdraví?</label>
                            <select
                                value={formData.podporaOkoli}
                                onChange={(e) => handleInputChange('podporaOkoli', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte odpověď</option>
                                <option value="ano-plne">Ano, plně</option>
                                <option value="castecne">Částečně</option>
                                <option value="neutralne">Neutrálně</option>
                                <option value="spise-ne">Spíše ne</option>
                                <option value="ne-vubec">Ne vůbec</option>
                            </select>
                        </div>
                    </div>
                );

            case 'zaznam':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Záznam jídelníčku (volitelné)</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Můžete mi poskytnout záznam 2–3 dnů vašeho typického jídelníčku?
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                Uveďte čas, co jste jedli/pili, množství, případně pocity...
                            </p>
                            <textarea
                                value={formData.zaznamJidelnicku}
                                onChange={(e) => handleInputChange('zaznamJidelnicku', e.target.value)}
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Příklad:
Den 1:
7:00 - káva s mlékem
10:00 - rohlík s máslem
13:00 - kuřecí řízek s bramborem (velká porce), pocit přejídání
16:00 - čaj, sušenky
19:00 - salát s tuňákem
..."
                            />
                        </div>
                    </div>
                );

            case 'motivace':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Motivace a očekávání</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Proč jste se rozhodli pro
                                výživové poradenství právě teď?</label>
                            <textarea
                                value={formData.duvodPoradenstvi}
                                onChange={(e) => handleInputChange('duvodPoradenstvi', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Co vás motivuje k této změně?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co očekáváte ode mě jako
                                poradce?</label>
                            <textarea
                                value={formData.ocekavani}
                                onChange={(e) => handleInputChange('ocekavani', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Jakou podporu a vedení od mě očekáváte?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jak moc jste připraveni
                                udělat změnu? (0–10)</label>
                            <select
                                value={formData.pripravenost}
                                onChange={(e) => handleInputChange('pripravenost', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">Vyberte úroveň</option>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num.toString()}>
                                        {num} {num <= 3 ? '(nízká)' : num <= 7 ? '(střední)' : '(vysoká)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Co by vás mohlo během
                                procesu brzdit?</label>
                            <textarea
                                value={formData.prekazy}
                                onChange={(e) => handleInputChange('prekazy', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="např. nedostatek času, finance, podpora rodiny, stres..."
                            />
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
                        disabled={currentSection === 0}
                        className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 mr-2"/>
                        Zpět
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        {currentSection === sections.length - 1 ? 'Dokončit' : 'Pokračovat'}
                        <ChevronRight className="h-5 w-5 ml-2"/>
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
