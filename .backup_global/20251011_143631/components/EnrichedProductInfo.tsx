"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Shield, Truck, Award } from 'lucide-react';

interface TechnicalSpec {
  [key: string]: string;
}

interface EnrichedProductInfoProps {
  marketingCopy?: string;
  technicalSpecs?: TechnicalSpec;
  keyFeatures?: string[];
  targetAudience?: string;
  longDescEs?: string;
  enrichedAt?: string;
}

export default function EnrichedProductInfo({
  marketingCopy,
  technicalSpecs,
  keyFeatures,
  targetAudience,
  longDescEs,
  enrichedAt
}: EnrichedProductInfoProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'features'>('description');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Si no hay datos enriquecidos, no mostrar nada
  if (!enrichedAt && !marketingCopy && !technicalSpecs && !keyFeatures) {
    return null;
  }

  const displayedFeatures = showAllFeatures 
    ? keyFeatures 
    : keyFeatures?.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Marketing Copy Header */}
      {marketingCopy && (
        <div className="bg-gradient-to-r from-lime-50 to-green-50 p-6 border-b">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed text-base">
              {marketingCopy}
            </p>
          </div>
          {targetAudience && (
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <Award className="w-4 h-4 text-lime-600" />
              <span>Ideal para: {targetAudience}</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-lime-600 text-lime-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📝 Descripción Detallada
          </button>
          
          {keyFeatures && keyFeatures.length > 0 && (
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'features'
                  ? 'border-lime-600 text-lime-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ⭐ Características
            </button>
          )}

          {technicalSpecs && Object.keys(technicalSpecs).length > 0 && (
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'specs'
                  ? 'border-lime-600 text-lime-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🔧 Especificaciones
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4">
            {longDescEs ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {longDescEs}
                </p>
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Descripción detallada en proceso de generación...
              </div>
            )}
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Producto Verificado</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Envío Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>Calidad Premium</span>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && keyFeatures && (
          <div className="space-y-3">
            {displayedFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-lime-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
              </div>
            ))}
            
            {keyFeatures && keyFeatures.length > 4 && (
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="flex items-center gap-2 text-lime-600 text-sm font-medium hover:text-lime-700 transition-colors"
              >
                {showAllFeatures ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Mostrar menos características
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Ver todas las características ({keyFeatures.length})
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && technicalSpecs && (
          <div className="space-y-3">
            {Object.entries(technicalSpecs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-600 text-right">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enriched Badge */}
      {enrichedAt && (
        <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
          <span>✨ Información enriquecida con IA</span>
          <span>Actualizado: {new Date(enrichedAt).toLocaleDateString('es-CL')}</span>
        </div>
      )}
    </div>
  );
}