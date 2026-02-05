// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSingleData from "@/hooks/useSingleData";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateData } from "@/lib/updateData";
import useAllTenderCategories from "@/hooks/useAllTenderCategories";
import { createData } from "@/lib/createData";
import { LoaderCircle, SkipBack } from "lucide-react";

export default function TenderCategoryFinder() {
  const { id } = useParams();
  const { data: tender, setReload } = useSingleData("https://egpserver.jubairahmad.com/api/v1/tenders/tenderId/" + id);
  const [jobTitle, setJobTitle] = useState(tender?.descriptionOfWorks || "");
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [newKeywordSuggestions, setNewKeywordSuggestions] = useState([]);
  const [uniqueMainCategories, setUniqueMainCategories] = useState({});
  const [allSubCategoryNames, setAllSubCategoryNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { categories: categoryData } = useAllTenderCategories();
  const [suggestionsData, setSuggestionsData] = useState([]);

  const stopWords = [
    "a", "an", "the", "of", "in", "on", "at", "for", "and", "or", "is",
    "are", "was", "were", "under", "with", "to", "from", "etc", "fy",
    "work", "works", "sub", "head", "ch", "no", "as", "by", "be", "new",
    "existing", "different", "towards", "area", "division", "starting",
    "detecting", "patients", "approach", "one", "all", "any", "com", "inc",
    "co", "ltd", "pvt", "llc", "ward", "name", "tender"
  ];

  // Helper function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Normalize function to handle variations like punctuation, camel case, etc.
  const normalize = (text) => {
    if (!text) return '';
    let result = text.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    result = result.toLowerCase();
    result = result.replace(/[^a-z0-9]+/g, ' ');
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  };

  // Updated findExistingCategories with stricter word-based matching and unique top 5 categories
  const findExistingCategories = (title, categories) => {
    const processedIds = [];
    const categoryMap = new Map();

    const normalizedTitle = normalize(title);
    const titleWords = new Set(
      normalizedTitle
        .split(' ')
        .filter(word => word.length > 2 && !stopWords.includes(word))
    );

    console.log("Normalized Title Words:", Array.from(titleWords));

    categories.forEach(item => {
      if (!item.sub_cat_name || !item.sub_cat_id) return;

      const normalizedSub = normalize(item.sub_cat_name);
      const subWords = normalizedSub
        .split(' ')
        .filter(word => word.length > 2 && !stopWords.includes(word));

      if (subWords.length === 0) return;

      console.log(`Checking Subcategory: ${item.sub_cat_name}, Normalized: ${normalizedSub}, Words: ${subWords}`);

      const overlap = subWords.filter(word => titleWords.has(word)).length;
      const score = overlap / subWords.length;

      if (score >= 0.5 && !processedIds.includes(item.sub_cat_id)) {
        const cat = item.cat_name || "N/A";
        const entry = { keyword: item.sub_cat_name, category: cat, score };

        if (!categoryMap.has(cat) || score > categoryMap.get(cat).score) {
          categoryMap.set(cat, entry);
        }

        processedIds.push(item.sub_cat_id);
      }
    });

    const matches = Array.from(categoryMap.values())
      .sort((a, b) => b.score - a.score || b.keyword.length - a.keyword.length)
      .slice(0, 5);

    console.log("Matched Categories:", matches);
    return matches;
  };

  // JS version of getUltimateKeywordSuggestions
  const getUltimateKeywordSuggestions = (title, categories, stopWords) => {
    const actionWords = [
      "construction", "supply", "repair", "re-construction", "upgrading",
      "extension", "manufacturing", "hiring", "washing", "renewal",
      "reconstruction", "procurement"
    ];
    const allStop = [...stopWords, ...actionWords];
    let cleanedTitle = normalize(title);

    const allKnownWords = [
      ...allStop,
      ...categories.map(c => normalize(c.sub_cat_name))
    ];
    allKnownWords.forEach(word => {
      if (word) {
        const escaped = escapeRegExp(word);
        cleanedTitle = cleanedTitle.replace(
          new RegExp(`\\b${escaped}\\b`, "gi"),
          " "
        );
      }
    });

    cleanedTitle = cleanedTitle
      .replace(/\b\d+(st|nd|rd|th)?\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleanedTitle.split(" ").filter(w => w.length > 2 && !stopWords.includes(w));
    if (!words.length) return [];

    let suggestions = [];
    [4, 3, 2].forEach(n => {
      if (words.length >= n) {
        for (let i = 0; i <= words.length - n; i++) {
          suggestions.push(words.slice(i, i + n).join(" "));
        }
      }
    });

    words.forEach(w => {
      if (w.length > 4) suggestions.push(w);
    });

    suggestions = [...new Set(suggestions)];

    suggestions.sort((a, b) => b.length - a.length);
    const finalSuggestions = [];
    suggestions.forEach(s => {
      if (!finalSuggestions.some(ex => ex.includes(s) && ex !== s)) {
        finalSuggestions.push(s);
      }
    });

    return finalSuggestions;
  };

  const handleAnalyze = () => {
    if (!jobTitle.trim()) {
      setErrorMessage("অনুগ্রহ করে কাজের নামের জন্য একটি বিবরণ দিন।");
      return;
    }
    setErrorMessage("");

    const matched = findExistingCategories(jobTitle, categoryData);
    const newSuggestions = getUltimateKeywordSuggestions(
      jobTitle,
      categoryData,
      stopWords
    );

    const subCatNames = categoryData.map(c => c.sub_cat_name);
    const uniqueCats = {};
    categoryData.forEach(c => {
      if (c.cat_id && c.cat_name) {
        uniqueCats[c.cat_id] = c.cat_name;
      }
    });

    setMatchedCategories(matched);
    setNewKeywordSuggestions(newSuggestions);
    setAllSubCategoryNames(subCatNames);
    setUniqueMainCategories(
      Object.fromEntries(Object.entries(uniqueCats).sort((a, b) => a[1].localeCompare(b[1])))
    );

    console.log("Analysis Result - Matched Categories:", matched, "New Suggestions:", newSuggestions);
  };

  const handleRedirect = () => {
    navigate(`/dashboard/tender-categoryNull`);
  };

  const handleUpdateCategory = () => {
    const selectedCategories = matchedCategories.map(m => m.category);
    const subCategories = matchedCategories.map(m => m.keyword);

    const selectedCategoriesString = [...new Set(selectedCategories)].join(','); // Ensure unique categories
    const SubCategoriesString = subCategories.join(',');
    const payload = {
      selectedTenderCategory: selectedCategoriesString,
      tender_subCategories: SubCategoriesString,
    };

   

    const url = `https://egp-tender-automation-server.vercel.app/api/v1/tenders/tenderId/${id}`;
    updateData(url, payload, null, handleRedirect);
  };

  const handleCategoryUpdate = () => {
    const url = `https://egp-tender-automation-server.vercel.app/api/v1/tender-categories/create-category`;
    createData(url, suggestionsData);
    console.log("New Category Suggestions Data:", suggestionsData);
  };

  const removeMatchedCategory = (index) => {
    setMatchedCategories(prev => prev.filter((_, i) => i !== index));
  };
// null, handleRedirect
  const handleSkipAnalyze = () => {
    updateData(`https://egpserver.jubairahmad.com/api/v1/tenders/tenderId/${id}`, { skip: true }, null, handleRedirect);
  }

  useEffect(() => {
    setJobTitle(tender?.descriptionOfWorks || "");
  }, [tender]);

  return (
    <section>
      <div className="max-w-4xl mx-auto">
        <Button className="cursor-pointer" id="page-reload-category-finder" onClick={() => window.location.reload()}>
          Reload <LoaderCircle />
        </Button>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-5">
        <h1 className="text-2xl font-bold text-blue-700 border-b pb-2">
          টেন্ডার ক্যাটাগরি ফাইন্ডার ও সাজেশন সিস্টেম
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded mt-4">
            {successMessage}
          </div>
        )}

        <Textarea
          className="w-full border p-3 rounded mt-4"
          value={jobTitle}
          readOnly
          placeholder="কাজের নামের বিবরণ লিখুন..."
        />
        <div className="flex gap-2.5 flex-wrap items-center">
          <Button
            onClick={handleAnalyze}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 "
          >
            বিশ্লেষণ করুন
          </Button>
          <Button
            onClick={handleSkipAnalyze}
            className="mt-3 px-4 py-2 "
          >
            <SkipBack />
            Skip
          </Button>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mt-4">
            {errorMessage}
          </div>
        )}

        {/* Matched Categories */}
        {matchedCategories.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-blue-700 border-b pb-1">
              শনাক্ত করা ক্যাটাগরি
            </h2>
            <table className="w-full border mt-3">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">কী-ওয়ার্ড</th>
                  <th className="border p-2">ক্যাটাগরি</th>
                  <th className="border p-2">অপসারণ</th>
                </tr>
              </thead>
              <tbody>
                {matchedCategories.map((m, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{m.keyword}</td>
                    <td className="border p-2">{m.category}</td>
                    <td className="border p-2 text-center">
                      <Button
                        onClick={() => removeMatchedCategory(idx)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matchedCategories.length > 0 && (
              <Button
                onClick={handleUpdateCategory}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ক্যাটাগরি আপডেট করুন
              </Button>
            )}
          </div>
        )}

        {/* New Suggestions */}
        {newKeywordSuggestions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-blue-700 border-b pb-1">
              নতুন কী-ওয়ার্ড সাজেশন
            </h2>
            <table className="w-full border mt-3">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">প্রস্তাবিত কী-ওয়ার্ড</th>
                  <th className="border p-2">ক্যাটাগরি নির্বাচন</th>
                </tr>
              </thead>
              <tbody>
                {newKeywordSuggestions.map((s, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={suggestionsData[idx]?.sub_cat_name || s}
                        className="border rounded p-1 w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSuggestionsData(prev => {
                            const updated = [...prev];
                            updated[idx] = {
                              ...updated[idx],
                              sub_cat_id: Date.now(),
                              sub_cat_name: value
                            };
                            return updated;
                          });
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        onChange={(e) => {
                          const selected = JSON.parse(e.target.value);
                          selected.cat_id = Number(selected.cat_id);
                          setSuggestionsData(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], ...selected };
                            return updated;
                          });
                          console.log("Selected Category:", suggestionsData);
                        }}
                        className="border rounded p-1 w-full"
                      >
                        <option value="">-- নির্বাচন করুন --</option>
                        {Object.entries(uniqueMainCategories).map(([id, name]) => (
                          <option key={id} value={JSON.stringify({ cat_id: id, cat_name: name })}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {suggestionsData.length > 0 && (
              <Button onClick={handleCategoryUpdate} className="w-full bg-green-600 mt-4">
                Update Category
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}