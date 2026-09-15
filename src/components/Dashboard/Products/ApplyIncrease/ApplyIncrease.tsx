'use client';

import TitleHeader from '@/src/components/TitleHeader/TitleHeader';
import { updateStockPriceReq } from '@/src/services/dashboard/products/products'; // adjust path if needed
import { TProductCategory } from '@/src/types/category.type';
import { TProduct } from '@/src/types/product.type';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Check, X, Package } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/src/hooks/use-translation';

type Props = {
    products: TProduct[];
    productCategries: TProductCategory[];
};

const ApplyIncrease = ({ products, productCategries }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [priceValue, setPriceValue] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Group products by primary category
    const groupedProducts = useMemo(() => {
        const groups: Record<
            string,
            { category: TProductCategory | null; products: TProduct[] }
        > = {};

        productCategries.forEach((cat) => {
            groups[cat._id] = { category: cat, products: [] };
        });

        products.forEach((product) => {
            const catId = product.category?._id;
            if (catId && groups[catId]) {
                groups[catId].products.push(product);
            } else {
                const fallbackKey = 'uncategorized';
                if (!groups[fallbackKey]) {
                    groups[fallbackKey] = { category: null, products: [] };
                }
                groups[fallbackKey].products.push(product);
            }
        });

        return Object.values(groups).filter((g) => g.products.length > 0);
    }, [products, productCategries]);

    const openEdit = (product: TProduct) => {
        setEditingProductId(product._id);
        setPriceValue(
            product.pricing?.price !== undefined && product.pricing?.price !== null
                ? String(product.pricing.price)
                : ''
        );
    };

    const closeEdit = () => {
        setEditingProductId(null);
        setPriceValue('');
    };

    const handleUpdatePrice = async (product: TProduct) => {
        const numericPrice = Number(priceValue);

        if (isNaN(numericPrice) || numericPrice < 0) {
            toast.error('Please enter a valid non-negative price');
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateStockPriceReq(product.productId, {
                newPrice: numericPrice,
            });

            if (result?.success || result?.data || result === null) {
                // catchAsync often returns null on success in some patterns
                toast.success('Price updated successfully');
                closeEdit();
                router.refresh();
            } else {
                toast.error(result?.message || 'Failed to update price');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while updating price');
        } finally {
            setIsUpdating(false);
        }
    };

    const getLocalizedName = (name: { en?: string; pt?: string } | string) => {
        if (typeof name === 'string') return name;
        return name?.en || name?.pt || 'Unnamed';
    };

    return (
        <div className="space-y-8">
            <TitleHeader
                title={t("apply_price_increase")}
                subtitle={t("update_the_base_price_your_products")}
            />

            {groupedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Package className="h-12 w-12 mb-3 opacity-40" />
                    <p>{t("no_products_found")}</p>
                </div>
            ) : (
                groupedProducts.map(({ category, products: catProducts }) => (
                    <section key={category?._id || 'uncategorized'} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base lg:text-xl font-semibold tracking-tight">
                                {category ? getLocalizedName(category.name) : 'Uncategorized'}
                            </h3>
                            <Badge variant="secondary" className="font-normal">
                                {catProducts.length} {t("product")}{catProducts.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                            {catProducts.map((product) => {
                                const isEditing = editingProductId === product._id;
                                const currentPrice = product.pricing?.price ?? 0;
                                const status = product.meta?.status || 'INACTIVE';
                                const isActive = status === 'ACTIVE';
                                const hasImage = product.images?.length > 0;

                                return (
                                    <Card
                                        key={product._id}
                                        className="overflow-hidden transition-all hover:shadow-md border-border/60"
                                    >
                                        {/* Image + Status badge */}
                                        <div className="relative aspect-16/10 bg-muted/40">
                                            {hasImage ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={getLocalizedName(product.name)}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-10 w-10 text-muted-foreground/40" />
                                                </div>
                                            )}

                                            <div className="absolute top-2.5 left-2.5">
                                                <Badge
                                                    className={
                                                        isActive
                                                            ? 'bg-emerald-500/90 hover:bg-emerald-500 text-white border-0'
                                                            : 'bg-zinc-500/90 hover:bg-zinc-500 text-white border-0'
                                                    }
                                                >
                                                    {status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardHeader className="pb-2 pt-4 px-4">
                                            <h4 className="font-semibold leading-snug line-clamp-2 text-[15px]">
                                                {getLocalizedName(product.name)}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t("sku")}: {product.sku}
                                            </p>
                                        </CardHeader>

                                        <CardContent className="px-4 pb-4 space-y-3">
                                            {/* Current price display / edit */}
                                            {!isEditing ? (
                                                <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">{t("price")}</span>
                                                        <span className="font-semibold text-[#DC3173]">
                                                            {product.pricing.currency} {currentPrice}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1.5 border-[#DC3173]/40 text-[#DC3173] hover:bg-[#DC3173]/10 hover:text-[#DC3173]"
                                                        onClick={() => openEdit(product)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        {t("edit")}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 rounded-lg border border-[#DC3173]/20 bg-[#DC3173]/3 p-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                            {product.pricing.currency}
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            value={priceValue}
                                                            onChange={(e) => setPriceValue(e.target.value)}
                                                            placeholder="0.00"
                                                            className="h-9 flex-1"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            disabled={isUpdating}
                                                            onClick={() => handleUpdatePrice(product)}
                                                            className="flex-1 h-9 gap-1.5 bg-[#DC3173] hover:bg-[#DC3173]/90 text-white"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            {isUpdating ? `${t("saving")}...` : t("save")}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isUpdating}
                                                            onClick={closeEdit}
                                                            className="h-9 gap-1.5"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            {t("cancel")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
};

export default ApplyIncrease;